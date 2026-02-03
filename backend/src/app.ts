import express from "express";
import cors from "cors";
import path from "path";
import employmentRoutes from "./routes/employment.routes";
import candidateRoutes from "./routes/candidate.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import verificationRoutes from "./routes/verification.routes";
import verificationCaseRoutes from "./routes/verificationCase.routes";
import candidateFormRoutes from "./routes/candidateForm.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/employment-verifications", employmentRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", verificationRoutes);
app.use("/api", verificationCaseRoutes);
app.use("/api", candidateFormRoutes);

export default app;
