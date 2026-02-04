import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAuditLogs = async (req: Request, res: Response) => {
  const { entityType, entityId } = req.query;

  const logs = await prisma.auditLog.findMany({
    where: {
      entityType: entityType as any,
      entityId: entityId as string,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(logs);
};
