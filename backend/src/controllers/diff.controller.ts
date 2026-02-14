import { Request, Response, NextFunction } from "express";
import { getVerificationItemDiff } from "../services/diff.service";

export const getItemDiff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const verificationItemId = req.params.verificationItemId as string;

    const diff = await getVerificationItemDiff(verificationItemId);

    res.json(diff);
  } catch (err) {
    next(err);
  }
};
