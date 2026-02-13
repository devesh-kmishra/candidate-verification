import { Request, Response, NextFunction } from "express";

// todo: temporary, replace with real auth
export function mockAuth(req: Request, res: Response, next: NextFunction) {
  req.user = {
    id: "mock-user-id",
    email: "admin@company.com",
    role: "ADMIN",
    organizationId: "mock-org-uuid",
  };

  next();
}
