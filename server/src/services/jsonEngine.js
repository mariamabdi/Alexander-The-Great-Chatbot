import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log("JSON ENGINE LOADING...");

// Fixes file path issues when running node from any directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const conversationPath = path.join(__dirname, "../data/conversation.json");

export const conversationData = JSON.parse(
  fs.readFileSync(conversationPath, "utf8")
);

console.log(
  "JSON LOADED - Nodes:",
  Object.keys(conversationData.conversationStates)
);

export function processMessage(userInput, currentState = "start") {
  console.log("PROCESSING:", userInput, "State:", currentState);

  const node = conversationData.conversationStates[currentState];

  if (!node) {
    console.log("NODE NOT FOUND:", currentState);
    return {
      botMessage: "My mind wanders... Let us begin anew.",
      nextState: "start"
    };
  }

  const input = userInput.toLowerCase();

  // Match keywords to userOption[]
  const matchedOption = node.userOptions.find(option =>
    option.userInput.some(keyword =>
      input.includes(keyword.toLowerCase())
    )
  );

  // If keyword matches → move to next state
  if (matchedOption) {
    console.log("MATCH FOUND:", matchedOption.nextState);

    return {
      botMessage: matchedOption.responseText,
      nextState: matchedOption.nextState
    };
  }

  // No match → fallback
// No match → fallback
console.log("NO MATCH - Fallback");

return {
  botMessage: node.fallbackMessage,
  nextState: currentState,
  isFallback: true
};

}
