import express from "express";
import { getCourseContent } from "../controllers/courseController";

const router = express.Router();

router.get("/:course_id", getCourseContent);

export default router;
