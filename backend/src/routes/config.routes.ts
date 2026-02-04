import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

// todo: create createVerificationConfig function
router.post(
  "/verification-config",
  requireRole([UserRole.ADMIN]),
  createVerificationConfig,
);
