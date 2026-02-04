import { Router } from "express";
import {
  getItemDiscrepancies,
  resolveDiscrepancy,
} from "../controllers/discrepancy.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get(
  "/verification-items/:verificationItemId/discrepancies",
  getItemDiscrepancies,
);
router.post(
  "/discrepancies/:discrepancyId/resolve",
  requireRole([UserRole.HR]),
  resolveDiscrepancy,
);

export default router;
