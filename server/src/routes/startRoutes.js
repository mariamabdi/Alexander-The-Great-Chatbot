import express from "express";
import { conversationData } from "../services/jsonEngine.js";

const router = express.Router();

router.get("/", (req, res) => {
  const start = conversationData.conversationStates.start;

  const msg =
    start.botMessage.type === "random"
      ? start.botMessage.messages[
          Math.floor(Math.random() * start.botMessage.messages.length)
        ]
      : start.botMessage;

  // Only show these four options 
  const options = [
    "military campaigns",
    "philosophical teachings",
    "personal life",
    "historical impact"
  ];

  res.json({ botMessage: msg, options });
});

export default router;
