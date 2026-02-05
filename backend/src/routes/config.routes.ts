import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";
import {
  createConfigHandler,
  getActiveConfigHandler,
} from "../controllers/verificationConfig.controller";

const router = Router();

router.post(
  "/verification-config",
  requireRole([UserRole.ADMIN]),
  createConfigHandler,
);

router.get(
  "/verification-config/:organizationId/active",
  requireRole([UserRole.ADMIN]),
  getActiveConfigHandler,
);

export default router;
