import { Request, Response, NextFunction } from "express";
import { createVerificationCaseFromConfig } from "../services/verificationCreation.service";

export const startCandidateVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const candidateId = req.params.candidateId as string;
    const { organizationId } = req.body; // todo: taken from auth later

    if (!organizationId) {
      return res.status(400).json({ error: "organizationId is required" });
    }

    const verificationCase = await createVerificationCaseFromConfig(
      candidateId,
      organizationId,
    );

    res.status(201).json({
      message: "Verification started",
      verificationCaseId: verificationCase.id,
    });
  } catch (err) {
    next(err);
  }
};
