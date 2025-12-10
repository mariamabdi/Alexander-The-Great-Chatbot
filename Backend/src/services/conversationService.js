// src/services/conversationService.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON conversation file
let conversationData = null;
try {
  const filePath = path.join(__dirname, "../data/conversation.json");
  const raw = fs.readFileSync(filePath, "utf8");
  conversationData = JSON.parse(raw);
  console.log("Conversation JSON loaded.");
} catch (err) {
  console.error("Error loading conversation JSON:", err);
}

// ------------------------
// Get random start message
// ------------------------
export function getStartMessage() {
  const start = conversationData.conversationStates.start;

  if (start.botMessage.type === "random") {
    const choices = start.botMessage.messages;
    return choices[Math.floor(Math.random() * choices.length)];
  }

  return start.botMessage;
}

// ------------------------
// Main conversation engine
// ------------------------
export function processConversation(userMessage, currentState) {
  const states = conversationData.conversationStates;
  const stateObj = states[currentState];

  const text = userMessage.toLowerCase();
  let match = null;

  // Keyword matching
  for (const option of stateObj.userOptions) {
    for (const word of option.userInput) {
      if (text.includes(word.toLowerCase())) {
        match = option;
        break;
      }
    }
    if (match) break;
  }

  // → MATCH FOUND (NOT FALLBACK)
  if (match) {
    const nextState = match.nextState;
    const nextObj = states[nextState];

    let botMsg = nextObj.botMessage;
    if (typeof botMsg === "object" && botMsg.type === "random") {
      botMsg = botMsg.messages[Math.floor(Math.random() * botMsg.messages.length)];
    }

    return {
      isFallback: false,
      botMessage: match.responseText + "\n\n" + botMsg,
      nextState,
    };
  }

  // → NO MATCH (FALLBACK)
  return {
    isFallback: true,
    botMessage: stateObj.fallbackMessage || "I do not understand.",
    nextState: currentState,
  };
}
