import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit.service";
import { AuditEntityType } from "../../generated/prisma/enums";

export const addCallingLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contactId = req.params.contactId as string;
    const { callTime, outcome, notes } = req.body;

    const contact = await prisma.verificationContact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return res.status(404).json({
        error: "Verification contact not found",
      });
    }

    const log = await prisma.callingLog.create({
      data: {
        verificationContactId: contactId,
        callTime: new Date(callTime),
        outcome,
        notes,
      },
    });

    await prisma.verificationContact.update({
      where: { id: contactId },
      data: {
        status: "CONTACTED",
        contactedAt: new Date(),
      },
    });

    await createAuditLog({
      entityType: AuditEntityType.VERIFICATION_CONTACT,
      entityId: contactId,
      action: "CALL_LOG_ADDED",
      metadata: {
        outcome,
        notes,
        callTime,
      },
      performedBy: req.user?.email,
      performedByRole: req.user?.role,
    });

    res.json(log);
  } catch (err) {
    next(err);
  }
};
