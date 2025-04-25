import { Router } from "express";
const aiRouter = Router();
import { sendMessage } from "../controllers/chatController";
import { getAutofillDocument } from "../controllers/aiAutofillController";

aiRouter.post("/chat", sendMessage);
aiRouter.post('/fill/document', getAutofillDocument);
export default aiRouter;
