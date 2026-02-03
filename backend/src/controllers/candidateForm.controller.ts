import { Request, Response } from "express";
import { generateCandidateVerificationForm } from "../services/candidateForm.service";
import { createContactsFromCandidateForm } from "../services/contactCreation.service";

export const getCandidateVerificationForm = async (
  req: Request,
  res: Response,
) => {
  const verificationCaseId = req.params.verificationCaseId as string;

  try {
    const form = await generateCandidateVerificationForm(verificationCaseId);

    res.json(form);
  } catch (err: any) {
    res.status(404).json({ error: err.message ?? "Failed to load form" });
  }
};

export const submitCandidateVerificationForm = async (
  req: Request,
  res: Response,
) => {
  const verificationCaseId = req.params.verificationCaseId as string;
  const { sections } = req.body;

  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: "Invalid form payload" });
  }

  try {
    const result = await createContactsFromCandidateForm(
      verificationCaseId,
      sections,
    );

    res
      .status(201)
      .json({
        message: "Verification contacts created successfully",
        ...result,
      });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Form submission failed" });
  }
};
