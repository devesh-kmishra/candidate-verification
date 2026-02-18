import { Router } from "express";
import {
  getVerifierForm,
  submitVerifierResponse,
} from "../controllers/verification.controller";

const router = Router();

router.get("/:token", getVerifierForm);
router.post("/:token", submitVerifierResponse);

export default router;
