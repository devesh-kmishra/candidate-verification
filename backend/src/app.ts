import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { prisma } from "./lib/prisma";
import candidateRoutes from "./routes/candidate.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import verifierRoutes from "./routes/verification.routes";
import candidateFormRoutes from "./routes/candidateForm.routes";
import discrepancyRoutes from "./routes/discrepancy.routes";
import diffRoutes from "./routes/diff.routes";
import organizationRoutes from "./routes/organization.routes";
import configRoutes from "./routes/config.routes";
import userRoutes from "./routes/user.routes";
import callingLogRoutes from "./routes/callingLog.routes";
import { mockAuth } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(mockAuth);

app.get("/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/organizations", organizationRoutes);
app.use("/api/verification-config", configRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/verification-case", candidateFormRoutes);
app.use("/api/verify", verifierRoutes);
app.use("/api/contacts/", callingLogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api", discrepancyRoutes);
app.use("/api", diffRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
    details: err.details || undefined,
  });
});

export default app;
