import { Request, Response, NextFunction } from "express";
import { generateCandidateVerificationForm } from "../services/candidateForm.service";
import { createContactsFromCandidateForm } from "../services/contactCreation.service";

export const getCandidateVerificationForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const verificationCaseId = req.params.verificationCaseId as string;

    const form = await generateCandidateVerificationForm(verificationCaseId);

    res.json(form);
  } catch (err) {
    next(err);
  }
};

export const submitCandidateVerificationForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const verificationCaseId = req.params.verificationCaseId as string;
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: "Invalid form payload" });
    }

    const result = await createContactsFromCandidateForm(
      verificationCaseId,
      sections,
    );

    res.status(201).json({
      message: "Verification contacts created successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
