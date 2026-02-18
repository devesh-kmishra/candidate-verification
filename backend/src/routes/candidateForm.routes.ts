import { Router } from "express";
import {
  getCandidateVerificationForm,
  submitCandidateVerificationForm,
} from "../controllers/candidateForm.controller";

const router = Router();

router.get("/:verificationCaseId/form", getCandidateVerificationForm);
router.post("/:verificationCaseId/form", submitCandidateVerificationForm);

export default router;
