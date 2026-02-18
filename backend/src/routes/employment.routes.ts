import { Router } from "express";
import {
  getVerificationForm,
  addCallingLog,
} from "../controllers/employment.controller";

const router = Router();

router.get("/form/:token", getVerificationForm);
router.post("/:id/calling-log", addCallingLog);

export default router;
