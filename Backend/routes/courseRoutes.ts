import express from "express";
import { getCourseContent, addMaterialComment, setCourseContent } from "../controllers/courseController";
const router = express.Router();

router.post("/:course_id/materials/:material_id/comments", addMaterialComment);
router.get("/:course_id", getCourseContent);
router.put("/:course_id", setCourseContent);

export default router;
