import { Router } from "express";
import { getItemDiff } from "../controllers/diff.controller";

const router = Router();

router.get("/verification-items/:verificationItemId/diff", getItemDiff);

export default router;
