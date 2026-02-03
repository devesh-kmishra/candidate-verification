import { Router } from "express";
import { startCandidateVerification } from "../controllers/verificationCase.controller";

const router = Router();

router.post(
  "/candidates/:candidateId/verification/start",
  startCandidateVerification,
);

export default router;
