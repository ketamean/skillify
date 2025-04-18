import express from "express";
import "dotenv/config";
const router = express.Router();
import { createCheckoutSession } from "../controllers/serviceController";
import aiRouter from "./aiRoutes";
router.post("/create-checkout-session", createCheckoutSession);
router.use("/ai", aiRouter);
export default router;
