import express, { NextFunction, Request, Response } from "express";
import { getCourseContent, addMaterialComment, setCourseContent } from "../controllers/courseController";
import supabase from "../config/database/supabase";
const router = express.Router();

router.post("/:course_id/materials/:material_id/comments", addMaterialComment);
router.get("/:course_id", getCourseContent);

router.get("/:course_id/instructor",
    async (req: Request, res: Response, next: NextFunction) => {
        const { course_id } = req.params;
        const userId = req.user.id
        const { data: courseId, error: courseIdError } = await supabase.from("courses").select("id").eq("id", course_id).eq("instructor_id", userId).single();
        if (courseIdError) {
            res.status(400).json({ error: "Cannot find course" });
            return;
        }
        // else if (courseId === null) {
        //     res.status(400).json({ error: "You are not the instructor of this course" });
        //     return;
        // }
        return next()
    },
    getCourseContent);

// router.get("/:course_id/descriptions", getCourseDescription)

router.put("/:course_id", setCourseContent);

export default router;
