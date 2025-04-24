import express from "express";
import "dotenv/config";
const router = express.Router();
import { createCheckoutSession } from "../controllers/serviceController";
import aiRouter from "./aiRoutes";
import searchRouter from "./searchRoutes";
import courseRouter from './courseRoutes'
import { checkAuth } from "../middlewares/checkAuth";

// APIs that DON'T need Auth
router.post("/create-checkout-session", createCheckoutSession);
router.use("/ai", aiRouter);
router.use("/search", searchRouter);


// APIs that need Auth
const router2 = express.Router();
router2.use("/courses", courseRouter)


router.use('/', checkAuth, router2)

export default router;
