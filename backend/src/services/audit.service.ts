import { AuditEntityType, UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

type AuditLogInput = {
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  metadata?: Record<string, any>;
  performedBy?: string;
  performedByRole?: UserRole;
};

export async function createAuditLog(input: AuditLogInput) {
  await prisma.auditLog.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata,
      performedBy: input.performedBy,
      performedByRole: input.performedByRole,
    },
  });
}
