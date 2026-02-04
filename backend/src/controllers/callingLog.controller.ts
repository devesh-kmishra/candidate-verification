import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit.service";
import { AuditEntityType } from "../../generated/prisma/enums";

export const addCallingLog = async (req: Request, res: Response) => {
  const { employmentVerificationId, callTime, outcome, notes } = req.body;

  const log = await prisma.callingLog.create({
    data: {
      employmentVerificationId,
      callTime: new Date(callTime),
      outcome,
      notes,
    },
  });

  await createAuditLog({
    entityType: AuditEntityType.VERIFICATION_ITEM,
    entityId: employmentVerificationId,
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
};
