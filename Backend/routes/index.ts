import express from "express";
import "dotenv/config";
const router = express.Router();
import { createCheckoutSession } from "../controllers/serviceController";
import aiRouter from "./aiRoutes";
import searchRouter from "./searchRoutes";
import courseRouter from './courseRoutes'

router.post("/create-checkout-session", createCheckoutSession);
router.use("/ai", aiRouter);
router.use("/search", searchRouter);
router.use("/courses", courseRouter)

export default router;
