import express from "express";
import { startConversation } from "./Controllers/startController.js";

const router = express.Router();
router.get("/", startConversation);

export default router;
