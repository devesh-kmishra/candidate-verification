import { Router } from "express";
import {
  getCandidateVerificationForm,
  submitCandidateVerificationForm,
} from "../controllers/candidateForm.controller";

const router = Router();

router.get(
  "/verification-cases/:verificationCaseId/form",
  getCandidateVerificationForm,
);
router.post(
  "/verification-cases/:verificationCaseId/form",
  submitCandidateVerificationForm,
);

export default router;
