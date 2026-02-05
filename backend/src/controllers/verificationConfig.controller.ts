import { Request, Response } from "express";
import {
  createVerificationConfig,
  getActiveVerificationConfig,
} from "../services/verificationConfig.service";

export const createConfigHandler = async (req: Request, res: Response) => {
  const config = await createVerificationConfig(req.body);

  res.status(201).json(config);
};

export const getActiveConfigHandler = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId as string;

  const config = await getActiveVerificationConfig(organizationId);

  res.json(config);
};
