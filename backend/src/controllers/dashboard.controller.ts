import { Request, Response, NextFunction } from "express";
import { getVerificationDashboardStats } from "../services/dashboard.service";

export const getVerificationDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await getVerificationDashboardStats();

    res.json(stats);
  } catch (err) {
    next(err);
  }
};
