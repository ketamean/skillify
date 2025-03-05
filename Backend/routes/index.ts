import express from "express";
import AuthRouter from './authRoutes'

const router = express.Router();

router.use("/auth", AuthRouter);

export default router;