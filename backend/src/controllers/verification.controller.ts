import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import {
  handleContactResponse,
  recalculateVerificationStatus,
} from "../services/verification.service";
import { validateAnswer } from "../utils/prisma";

export const getVerifierForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.params.token as string;

    const contact = await prisma.verificationContact.findUnique({
      where: { token },
      include: {
        verificationItem: {
          include: {
            verificationCase: {
              include: {
                candidate: true,
              },
            },
            verificationTypeConfig: {
              include: {
                questions: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!contact) {
      return res.status(404).json({ error: "Invalid or expired link" });
    }

    if (contact.tokenExpiresAt < new Date()) {
      return res.status(410).json({ error: "Verification link expired" });
    }

    const { candidate } = contact.verificationItem.verificationCase;
    const questions = contact.verificationItem.verificationTypeConfig.questions;

    res.json({
      contactId: contact.id,
      candidate: {
        name: candidate.name,
      },
      verificationType: contact.verificationItem.verificationTypeConfig.type,
      questions: questions.map((q) => ({
        key: q.key,
        label: q.label,
        type: q.type,
        required: q.required,
        options: q.options,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const submitVerifierResponse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.params.token as string;
    const { answers } = req.body;

    const contact = await prisma.verificationContact.findUnique({
      where: { token },
    });

    if (!contact) {
      return res.status(404).json({ error: "Invalid token" });
    }

    const item = await prisma.verificationItem.findUnique({
      where: { id: contact.verificationItemId },
      include: {
        verificationTypeConfig: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!item) {
      return res.status(400).json({ error: "Invalid verification item" });
    }

    const questionMap = Object.fromEntries(
      item.verificationTypeConfig.questions.map((q) => [
        q.key,
        { label: q.label, type: q.type },
      ]),
    );

    await prisma.verificationResponse.createMany({
      data: Object.entries(answers).map(([key, value]) => ({
        verificationContactId: contact.id,
        questionKey: key,
        questionLabel: questionMap[key]?.label ?? key,
        questionType: questionMap[key]?.type ?? "TEXT",
        answer: validateAnswer(questionMap[key].type, value),
      })),
    });

    await prisma.verificationContact.update({
      where: { id: contact.id },
      data: {
        status: "RESPONDED",
        respondedAt: new Date(),
      },
    });

    await recalculateVerificationStatus(contact.verificationItemId);

    await handleContactResponse(contact.id);

    res.json({ message: "Verification submitted successfully" });
  } catch (err) {
    next(err);
  }
};
