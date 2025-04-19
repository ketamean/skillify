import express from "express";
import { searchCourses } from "../controllers/searchController";

const router = express.Router();

router.post("/", searchCourses);

export default router;