import { Request, Response, NextFunction } from "express";
import { createOrganization } from "../services/organization.service";
import { createAuditLog } from "../services/audit.service";
import { AuditEntityType } from "../../generated/prisma/enums";

export const createOrganizationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, domain } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Organization name is required" });
    }

    const org = await createOrganization({ name, domain });

    await createAuditLog({
      entityType: AuditEntityType.ORGANIZATION,
      entityId: org.id,
      action: "ORGANIZATION_CREATED",
      performedBy: req.user?.email,
      performedByRole: req.user?.role,
    });

    res.status(201).json(org);
  } catch (err) {
    next(err);
  }
};
