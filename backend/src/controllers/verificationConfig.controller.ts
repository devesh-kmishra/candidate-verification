import { Request, Response, NextFunction } from "express";
import {
  createVerificationConfig,
  getActiveVerificationConfig,
} from "../services/verificationConfig.service";

export const createConfigHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const config = await createVerificationConfig(req.body);

    res.status(201).json(config);
  } catch (err) {
    next(err);
  }
};

export const getActiveConfigHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.organizationId as string;

    const config = await getActiveVerificationConfig(organizationId);

    res.json(config);
  } catch (err) {
    next(err);
  }
};
