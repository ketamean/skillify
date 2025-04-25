import express from "express";
import {
  searchCourses,
  searchCoursesByTopic,
} from "../controllers/searchController";

const router = express.Router();

router.get("/topic/:topicId", searchCoursesByTopic);
router.post("/", searchCourses);

export default router;
