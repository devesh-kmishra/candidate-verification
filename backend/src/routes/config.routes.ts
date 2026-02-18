import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";
import {
  createConfigHandler,
  getActiveConfigHandler,
} from "../controllers/verificationConfig.controller";

const router = Router();

router.post("/", requireRole([UserRole.ADMIN]), createConfigHandler);

router.get(
  "/:organizationId/active",
  requireRole([UserRole.ADMIN]),
  getActiveConfigHandler,
);

export default router;
