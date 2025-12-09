// groqService.js
import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Check for missing API key
if (!process.env.GROQ_API_KEY) {
  console.warn(
    "Warning: GROQ_API_KEY is not set. Groq calls will return a fallback message."
  );
}

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Alexander the Great system prompt
const alexanderPrompt = `
You are Alexander the Great — the conqueror, strategist, and philosopher-king.
Speak boldly, dramatically, and in character.
`;

/**
 * Sends a message to Groq and returns the AI's response.
 * If the API key is missing or an error occurs, returns a fallback message.
 * 
 * @param {string} message - The user input
 * @returns {Promise<string>} - The bot reply
 */
export async function askGroq(message) {
  if (!process.env.GROQ_API_KEY) {
    return "Even I, Alexander, cannot speak — the oracles fail me.";
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-8192",
      messages: [
        { role: "system", content: alexanderPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    return completion.choices?.[0]?.message?.content || 
           "Even I, Alexander, cannot speak — the oracles fail me.";
  } catch (err) {
    console.error("LLM error:", err);
    return "Even I, Alexander, cannot speak — the oracles fail me.";
  }
}
