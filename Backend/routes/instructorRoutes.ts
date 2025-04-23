import express from "express";
import instructorController from "../controllers/instructorController";
import { ArrayFiles } from '../middleware/files'
import upload from '../config/files/multer';
const router = express.Router();

router.post('/upload', upload.array('videos'), instructorController.uploadPublicVideos);

export default router;