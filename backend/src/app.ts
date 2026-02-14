import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import employmentRoutes from "./routes/employment.routes";
import candidateRoutes from "./routes/candidate.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import verificationRoutes from "./routes/verification.routes";
import candidateFormRoutes from "./routes/candidateForm.routes";
import discrepancyRoutes from "./routes/discrepancy.routes";
import diffRoutes from "./routes/diff.routes";
import organizationRoutes from "./routes/organization.routes";
import configRoutes from "./routes/config.routes";
import userRoutes from "./routes/user.routes";
import { mockAuth } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(mockAuth);

app.use("/api/employment-verifications", employmentRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api", verificationRoutes);
app.use("/api", candidateFormRoutes);
app.use("/api", discrepancyRoutes);
app.use("/api", diffRoutes);
app.use("/api", organizationRoutes);
app.use("/api", configRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("GLOBAL ERROR:", err);

  res
    .status(err.statusCode || 500)
    .json({
      error: err.message || "Internal Server Error",
      details: err.details || undefined,
    });
});

export default app;
