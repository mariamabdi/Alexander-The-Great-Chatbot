import express from "express";
import { getSession, updateSession } from "../services/sessionService.js";
import { processConversation } from "../services/conversationService.js";
import { askGroq } from "../services/groqService.js";

const router = express.Router();

const MAX_HISTORY = 8;

// Helper: remove wrapping quotation marks from LLM replies
function stripOuterQuotes(str) {
  if (typeof str !== "string") return str;
  return str.replace(/^"(.*)"$/, "$1");
}

// Helper: keep memory bounded
function trimHistory(history) {
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
}

router.post("/", async (req, res) => {
  let { message, sessionId } = req.body;

  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
  }

  const session = getSession(sessionId);
  const currentState = session.currentState;

  // Store user message in memory
  session.history.push({
    role: "user",
    content: message
  });

  // JSON conversation engine
  const result = processConversation(message, currentState);

  let botReply;

  // Fallback to Groq ONLY if JSON fails
  if (result.isFallback) {
    let aiReply = await askGroq(message, session.history);
    aiReply = stripOuterQuotes(aiReply);
    botReply = aiReply;
  } else {
    botReply = result.botMessage;
  }

  // Store bot reply in memory
  session.history.push({
    role: "assistant",
    content: botReply
  });

  // Trim memory
  trimHistory(session.history);

  // Update state
  updateSession(sessionId, result.nextState);

  res.json({
    botMessage: botReply,
    nextState: result.nextState,
    sessionId
  });
});

export default router;
