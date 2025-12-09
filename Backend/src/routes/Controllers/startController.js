// startController.js
import { processConversation } from "../../services/conversationService.js";
import { getSession, updateSession } from "../../services/sessionService.js";
import { askGroq } from "../../services/groqService.js";

export async function startConversation(req, res) {
  const { message, sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ botMessage: "Missing sessionId." });
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

  res.json({
    botMessage: botReply,
    nextState: result.nextState,
  });
}
