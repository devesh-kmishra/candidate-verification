import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";
import { createUserHandler } from "../controllers/user.controller";

const router = Router();

router.post("/", requireRole([UserRole.ADMIN]), createUserHandler);

export default router;
