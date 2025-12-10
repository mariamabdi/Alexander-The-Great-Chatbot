import express from "express";
import { processMessage } from "../services/jsonEngine.js";
import { conversationData } from "../services/jsonEngine.js"; // ensures we can access states

const router = express.Router();

// Simple session store
const userSessions = {};

router.post("/", (req, res) => {
  const { message, sessionId = "default" } = req.body;

  console.log("JSON ENGINE CALLED - User said:", message);

  // Create session if missing
  if (!userSessions[sessionId]) {
    userSessions[sessionId] = { currentState: "start" };
  }

  const session = userSessions[sessionId];
  const currentState = session.currentState;

  // Process message through JSON state machine
  const result = processMessage(message, currentState);

  // Update session state
  session.currentState = result.nextState;

  console.log("JSON ENGINE RESPONSE:", result.botMessage);

  // Build options list based on next state
  const nextStateObj = conversationData.conversationStates[result.nextState];
  const options = nextStateObj?.userOptions?.map(opt => opt.userInput[0]) || [];

  res.json({
    botMessage: result.botMessage,
    nextState: result.nextState,
    options
  });
});

export default router;
