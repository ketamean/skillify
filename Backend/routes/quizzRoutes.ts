import express, { Request, Response } from "express";
import { getQuizStats, addQuizzAttemp,getUserQuiz } from "../controllers/quizzController";
import supabase from "../config/database/supabase";
import { error } from "console";

const router = express.Router();

router.get("/:quiz_id", getQuizStats);
router.get("/myquiz/:user_id", getUserQuiz);
router.post("/:quiz_id", addQuizzAttemp);


export default router;
