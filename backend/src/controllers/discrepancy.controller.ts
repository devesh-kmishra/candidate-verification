import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { applyDiscrepancyResolution } from "../services/discrepancyResolution.service";
import { createAuditLog } from "../services/audit.service";
import { AuditEntityType } from "../../generated/prisma/enums";

export const getItemDiscrepancies = async (req: Request, res: Response) => {
  const verificationItemId = req.params.verificationItemId as string;

  const disrepancies = await prisma.verificationDiscrepancy.findMany({
    where: { verificationItemId },
    orderBy: { createdAt: "asc" },
  });

  res.json(disrepancies);
};

export const resolveDiscrepancy = async (req: Request, res: Response) => {
  const discrepancyId = req.params.discrepancyId as string;
  const { action, note, resolvedBy } = req.body;

  if (!["ACCEPTED", "REJECTED", "OVERRIDDEN"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  const discrepancy = await prisma.verificationDiscrepancy.update({
    where: { id: discrepancyId },
    data: {
      status: action,
      resolutionNote: note,
      resolvedBy,
      resolvedAt: new Date(),
    },
  });

  await applyDiscrepancyResolution(discrepancy.id);

  await createAuditLog({
    entityType: AuditEntityType.VERIFICATION_ITEM,
    entityId: discrepancy.verificationItemId,
    action: `DISCREPANCY_${action}`,
    metadata: {
      discrepancyId: discrepancy.id,
      note,
    },
    performedBy: req.user?.email,
    performedByRole: req.user?.role,
  });

  res.json({ message: "Discrepancy resolved", discrepancy });
};
