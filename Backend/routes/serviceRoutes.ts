import express from "express";
const router = express.Router();
import { handleStripeRedirect} from "../controllers/serviceController";

router.get("/stripe", handleStripeRedirect);
export default router;