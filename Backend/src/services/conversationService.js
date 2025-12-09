import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve file location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load conversation JSON
const conversationPath = path.join(__dirname, "../data/conversation.json");
const conversationData = JSON.parse(fs.readFileSync(conversationPath, "utf8"));

export function processConversation(message, currentState) {
  const states = conversationData.conversationStates;
  const stateObj = states[currentState] || states["start"];

  const userText = message.toLowerCase();
  let matchedOption = null;

  // Keyword matching
  for (const option of stateObj.userOptions) {
    for (const keyword of option.userInput) {
      if (userText.includes(keyword.toLowerCase())) {
        matchedOption = option;
        break;
      }
    }
    if (matchedOption) break;
  }

  // -------------------------
  // 1. MATCH FOUND
  // -------------------------
  if (matchedOption) {
    const next = matchedOption.nextState;
    const nextObj = states[next];

    let nextBotMessage = "";

    if (typeof nextObj.botMessage === "object" &&
        nextObj.botMessage.type === "random") 
    {
      const arr = nextObj.botMessage.messages;
      nextBotMessage = arr[Math.floor(Math.random() * arr.length)];
    } 
    else {
      nextBotMessage = nextObj.botMessage;
    }

    return {
      botMessage: matchedOption.responseText + "\n\n" + nextBotMessage,
      nextState: next,
      isFallback: false
    };
  }

  // -------------------------
  // 2. NO MATCH → FALLBACK
  // -------------------------
  return {
    botMessage: stateObj.fallbackMessage || "I do not understand.",
    nextState: currentState,
    isFallback: true
  };
}
