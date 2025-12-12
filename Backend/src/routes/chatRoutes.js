import express from "express";
import { getSession, updateSession } from "../services/sessionService.js";
import { processConversation } from "../services/conversationService.js";
import { askGroq } from "../services/groqService.js";

const router = express.Router();

// Helper: remove wrapping quotation marks from LLM replies
function stripOuterQuotes(str) {
  if (typeof str !== "string") return str;
  return str.replace(/^"(.*)"$/, "$1");
}

router.post("/", async (req, res) => {
  let { message, sessionId } = req.body;

  // Ensure sessionId exists
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
  }

  const session = getSession(sessionId);
  const currentState = session.currentState;

  // 1. JSON conversation engine
  const result = processConversation(message, currentState);

  let botReply;

  // 2. Fallback to Groq ONLY if JSON fails
  if (result.isFallback) {
    let aiReply = await askGroq(messag, session.history);
    aiReply = stripOuterQuotes(aiReply);
    botReply = aiReply;
  } else {
    botReply = result.botMessage;
  }

  // 3. Update session state
  updateSession(sessionId, result.nextState);

  res.json({
    botMessage: botReply,
    nextState: result.nextState,
    sessionId
  });
});

export default router;
