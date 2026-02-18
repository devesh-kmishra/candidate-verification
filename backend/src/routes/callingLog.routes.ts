import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";
import { addCallingLog } from "../controllers/callingLog.controller";

const router = Router();

router.post("/:contactId/call-log", requireRole([UserRole.HR]), addCallingLog);

export default router;
