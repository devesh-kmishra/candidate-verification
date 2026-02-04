import { Request, Response } from "express";
import { getVerificationDashboardStats } from "../services/dashboard.service";

export const getVerificationDashboard = async (req: Request, res: Response) => {
  const stats = await getVerificationDashboardStats();

  res.json(stats);
};
