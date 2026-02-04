import { Request, Response } from "express";
import { getVerificationItemDiff } from "../services/diff.service";

export const getItemDiff = async (req: Request, res: Response) => {
  const verificationItemId = req.params.verificationItemId as string;

  const diff = await getVerificationItemDiff(verificationItemId);

  res.json(diff);
};
