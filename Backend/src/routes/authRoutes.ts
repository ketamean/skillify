import express from "express";
import AuthController from "../controllers/authController";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;