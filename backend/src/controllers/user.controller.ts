import { Request, Response, NextFunction } from "express";
import { AuditEntityType, UserRole } from "../../generated/prisma/enums";
import { createUser } from "../services/user.service";
import { createAuditLog } from "../services/audit.service";

export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: "Email and Role are required" });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: "Invalid user role" });
    }

    // todo: fetch organizationId from auth
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(403).json({ error: "Organization context missing" });
    }

    const user = await createUser({ email, role, organizationId });

    await createAuditLog({
      entityType: AuditEntityType.ORGANIZATION,
      entityId: organizationId,
      action: "USER_CREATED",
      metadata: {
        userEmail: user.email,
        role: user.role,
      },
      performedBy: req.user?.email,
      performedByRole: req.user?.role,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
