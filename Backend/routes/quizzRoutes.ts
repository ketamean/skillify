import express, { Request, Response } from "express";
import { getQuizStats, addQuizzAttemp } from "../controllers/quizzController";
import supabase from "../config/database/supabase";
import { error } from "console";

const router = express.Router();

router.get("/:quiz_id", getQuizStats);
router.post("/:quiz_id", addQuizzAttemp);


export default router;
