import express from "express";
import "dotenv/config";
const router = express.Router();
import { createCheckoutSession } from "../controllers/serviceController";
import aiRouter from "./aiRoutes";
import searchRouter from "./searchRoutes";
import courseRouter from './courseRoutes'
import { checkAuth } from "../middlewares/checkAuth";
import quizRouter from './quizzRoutes'
// APIs that DON'T need Auth
router.post("/create-checkout-session", createCheckoutSession);
router.use("/ai", aiRouter);
router.use("/search", searchRouter);


// APIs that need Auth
const router2 = express.Router();
router2.use("/courses", courseRouter)
router2.use("/quizzes", quizRouter)

router.use('/', checkAuth, router2)

export default router;
