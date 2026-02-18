import { Router } from "express";
import {
  getVerifierForm,
  submitVerifierResponse,
} from "../controllers/verification.controller";

const router = Router();

router.get("/verify/:token", getVerifierForm);
router.post("/verify/:token", submitVerifierResponse);

export default router;
