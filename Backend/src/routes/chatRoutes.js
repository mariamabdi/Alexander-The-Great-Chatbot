import express from "express";
import { getSession, updateSession } from "../services/sessionService.js";
import { processConversation } from "../services/conversationService.js";
import { askGroq } from "../services/groqService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let { message, sessionId } = req.body;

  // Auto-generate sessionId if missing
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    console.log(`Generated new sessionId: ${sessionId}`);
  }

  const session = getSession(sessionId);
  const currentState = session.currentState;

  // 1. Process via JSON conversation logic
  const result = processConversation(message, currentState);

  // 2. If no keyword match → fallback to Groq
  let botReply = "";
  if (result.isFallback) {
    const aiReply = await askGroq(message);
    botReply = result.botMessage + "\n\n" + aiReply;
  } else {
    botReply = result.botMessage;
  }

  // 3. Update session state
  updateSession(sessionId, result.nextState);

  // Return bot response and sessionId so frontend can persist it
  res.json({
    botMessage: botReply,
    nextState: result.nextState,
    sessionId,
  });
});

export default router;
