import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { fileURLToPath } from "url";

app.get("/", (req, res) => {
  res.send("Backend is running on port 9990!");
});

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = 9990;

app.use(cors());
app.use(express.json());

// Load JSON conversation file
let conversationData = null;
try {
  const filePath = path.join(__dirname, "data", "conversation.json");
  const content = fs.readFileSync(filePath, "utf8");
  conversationData = JSON.parse(content);
  console.log("Conversation JSON loaded.");
} catch (err) {
  console.error("Error loading conversation.json:", err);
}

// Track user sessions
const sessions = {};

// Groq LLM setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const alexanderPrompt = `
You are Alexander the Great — the conqueror, strategist, and philosopher-king.
Speak boldly and remain in character. If the user asks something unrelated to the scripted paths, reply naturally as Alexander.
`;

// Ask Groq LLM
async function askGroq(message) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-8192",
      messages: [
        { role: "system", content: alexanderPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;

  } catch (err) {
    console.error("LLM error:", err);
    return "Even I, Alexander, cannot speak — the oracles fail me.";
  }
}

// First message shown on chatbot start
app.get("/api/start", (req, res) => {
  const start = conversationData.conversationStates.start;

  let msg =
    start.botMessage.type === "random"
      ? start.botMessage.messages[
          Math.floor(Math.random() * start.botMessage.messages.length)
        ]
      : start.botMessage;

  res.json({ botMessage: msg });
});

// Main chat route
app.post("/api/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ botMessage: "Missing sessionId." });
  }

  // Create session if it doesn't exist
  if (!sessions[sessionId]) {
    sessions[sessionId] = { currentState: "start" };
  }

  let state = sessions[sessionId].currentState;
  const states = conversationData.conversationStates;

  if (!states[state]) {
    state = "start";
  }

  const stateObj = states[state];
  const userText = message.toLowerCase();
  let match = null;

  // Keyword matching
  for (const option of stateObj.userOptions) {
    for (const keyword of option.userInput) {
      if (userText.includes(keyword.toLowerCase())) {
        match = option;
        break;
      }
    }
    if (match) break;
  }

  // If a state option matched
  if (match) {
    const next = match.nextState;
    sessions[sessionId].currentState = next;

    const nextObj = states[next];
    let botReply = "";

    if (
      typeof nextObj.botMessage === "object" &&
      nextObj.botMessage.type === "random"
    ) {
      const msgs = nextObj.botMessage.messages;
      botReply = msgs[Math.floor(Math.random() * msgs.length)];
    } else {
      botReply = nextObj.botMessage;
    }

    return res.json({
      botMessage: match.responseText + "\n\n" + botReply,
      nextState: next,
    });
  }

  // If no match found, use LLM fallback
  const aiReply = await askGroq(message);

  return res.json({
    botMessage: (stateObj.fallbackMessage || "I do not understand.") + "\n\n" + aiReply,
    nextState: state,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});