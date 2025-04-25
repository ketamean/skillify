import { Router } from "express";
const aiRouter = Router();
import { sendMessage } from "../controllers/chatController";
import { getAutofillDocument, getAutofillVideo } from "../controllers/aiAutofillController";

aiRouter.post("/chat", sendMessage);
aiRouter.post('/fill/document', getAutofillDocument);
aiRouter.post('/fill/video', getAutofillVideo);
export default aiRouter;
