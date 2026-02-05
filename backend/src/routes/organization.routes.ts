import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";
import { createOrganizationHandler } from "../controllers/organization.controller";

const router = Router();

router.post(
  "/organizations",
  requireRole([UserRole.ADMIN]),
  createOrganizationHandler,
);

export default router;
