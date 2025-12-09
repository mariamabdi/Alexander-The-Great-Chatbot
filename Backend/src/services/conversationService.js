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

export default conversationData;
