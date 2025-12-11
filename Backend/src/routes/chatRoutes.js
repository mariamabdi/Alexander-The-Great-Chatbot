import express from "express";
import { getSession, updateSession } from "../services/sessionService.js";
import { processConversation } from "../services/conversationService.js";
import { askGroq } from "../services/groqService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let { message, sessionId } = req.body;

  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    console.log(`Generated new sessionId: ${sessionId}`);
  }

  const session = getSession(sessionId);
  const currentState = session.currentState;

  const result = processConversation(message, currentState);

  let botReply = "";

  if (result.isFallback) {
    const aiReply = await askGroq(message);
    botReply = result.botMessage + "\n\n" + aiReply;   // <-- JSON fallback + LLM
  } else {
    botReply = result.botMessage;
  }

  updateSession(sessionId, result.nextState);

  res.json({
    botMessage: botReply,
    nextState: result.nextState,
    sessionId,
  });
});

export default router;
