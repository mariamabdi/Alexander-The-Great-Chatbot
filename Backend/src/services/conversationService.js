import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let conversationData = null;

try {
  const filePath = path.join(__dirname, "../data/conversation.json");
  const content = fs.readFileSync(filePath, "utf8");
  conversationData = JSON.parse(content);
  console.log("Conversation JSON loaded.");
} catch (err) {
  console.error("Error loading conversation.json:", err);
}

/**
 * Processes the user message based on the current conversation state.
 */
export function processConversation(userInput, currentState = "start") {
  if (!conversationData) {
    return {
      botMessage: "Conversation data failed to load.",
      nextState: currentState,
      isFallback: true
    };
  }

  const node = conversationData.conversationStates[currentState];

  if (!node) {
    return {
      botMessage: "I seem to have lost my place. Let us begin anew.",
      nextState: "start",
      isFallback: false
    };
  }

  const input = userInput.toLowerCase();
  const matchedOption = node.userOptions.find(option =>
    option.userInput.some(keyword => input.includes(keyword.toLowerCase()))
  );

  if (matchedOption) {
    return {
      botMessage: matchedOption.responseText,
      nextState: matchedOption.nextState,
      isFallback: false
    };
  }

  // No match → fallback to Groq
  return {
    botMessage: node.fallbackMessage,
    nextState: currentState,
    isFallback: true
  };
}
