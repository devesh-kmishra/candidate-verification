import { Request, Response } from "express";
import { createVerificationCaseFromConfig } from "../services/verificationCreation.service";

export const startCandidateVerification = async (
  req: Request,
  res: Response,
) => {
  const candidateId = req.params.candidateId as string;
  const { organizationId } = req.body; // todo: taken from auth later

  if (!organizationId) {
    return res.status(400).json({ error: "organizationId is required" });
  }

  try {
    const verificationCase = await createVerificationCaseFromConfig(
      candidateId,
      organizationId,
    );

    res.status(201).json({
      message: "Verification started",
      verificationCaseId: verificationCase.id,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message ?? "Failed to start verification" });
  }
};
