import { Router } from "express";
import { submitVerificationResponse } from "../controllers/verification.controller";

const router = Router();

router.post("/verify/:token", submitVerificationResponse);

export default router;
