import express from "express";
import { getQuizStats, addQuizzAttemp } from "../controllers/quizzController";

const router = express.Router();

router.get("/:quiz_id", getQuizStats);
router.post("/:quiz_id", addQuizzAttemp);


export default router;
