import express from "express";
import "dotenv/config";
const router = express.Router();
import { createCheckoutSession } from "../controllers/serviceController";

router.post("/create-checkout-session", createCheckoutSession);

export default router;
