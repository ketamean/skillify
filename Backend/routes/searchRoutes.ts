import express from "express";
import {
  searchCourses,
  searchCoursesByTopic,
  searchCoursesByKeyword,
} from "../controllers/searchController";

const router = express.Router();

router.get("/topic/:topicId", searchCoursesByTopic);
router.get("/keyword", searchCoursesByKeyword);
router.post("/", searchCourses);

export default router;
