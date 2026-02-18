import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const getVerificationForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.params.token as string;

    const verification = await prisma.employmentVerification.findUnique({
      where: { verificationToken: token },
    });

    if (!verification || verification.tokenExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    res.json({
      previousCompanyName: verification.previousCompanyName,
      designation: verification.designation,
      tenureFrom: verification.tenureFrom,
      tenureTo: verification.tenureTo,
      questions: [
        {
          key: "designation_match",
          label: "Is designation correct?",
          type: "boolean",
        },
        { key: "tenure_match", label: "Is tenure correct?", type: "boolean" },
        { key: "remarks", label: "Remarks", type: "text" },
      ],
    });
  } catch (err) {
    next(err);
  }
};

export const addCallingLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const { callTime, outcome, notes } = req.body;

    const log = await prisma.callingLog.create({
      data: {
        employmentVerificationId: id,
        callTime,
        outcome,
        notes,
      },
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};
