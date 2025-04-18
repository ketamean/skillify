import { Router } from "express";
const aiRouter = Router();
import { sendMessage } from "../controllers/chatController";

aiRouter.post("/chat", sendMessage);
export default aiRouter;
