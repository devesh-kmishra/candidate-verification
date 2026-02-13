import { Router } from "express";
import {
  addCandidateNote,
  createCandidate,
  // getCandidateOverview,
  getCandidateSummary,
  // getEmploymentTimeline,
  // getVerificationQueue,
  // searchCandidates,
  uploadCandidateResume,
} from "../controllers/candidate.controller";
import { upload } from "../utils/fileUpload";
import { startCandidateVerification } from "../controllers/verificationCase.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

// router.get("/queue", getVerificationQueue);
// router.get("/search", searchCandidates);
// router.get("/:candidateId/employment-timeline", getEmploymentTimeline);
router.get(
  "/:candidateId/summary",
  requireRole([UserRole.ADMIN, UserRole.HR]),
  getCandidateSummary,
);
// router.get("/:candidateId/overview", getCandidateOverview);
router.post("/:candidateId/notes", addCandidateNote);
router.post(
  "/:candidateId/resume",
  upload.single("resume"),
  uploadCandidateResume,
);
router.post("/:candidateId/verification/start", startCandidateVerification);
router.post("/", createCandidate);

export default router;
