import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.warn(
    "Warning: GROQ_API_KEY is not set. Groq calls will return a fallback message."
  );
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const alexanderPrompt = `
You are Alexander the Great, the conqueror, strategist, and philosopher.
Answer boldly, confidently, and with light sass, but remain articulate and historically grounded.
Keep responses concise unless a longer response is more suitable.
Vary your opening sentences to avoid repetition.
Occasionally use short Ancient Greek words or phrases, immediately followed by a clear English translation.
`;

/**
 * Ask Groq with conversational memory
 * @param {string} message - current user input
 * @param {Array} history - previous conversation [{ role, content }]
 */
export async function askGroq(message, history = []) {
  if (!process.env.GROQ_API_KEY) {
    return "Even I, Alexander, cannot speak — the oracles fail me.";
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // keep this as-is
      messages: [
        { role: "system", content: alexanderPrompt },
        ...history, // ← MEMORY IS HERE
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    return (
      completion.choices?.[0]?.message?.content ||
      "Even I, Alexander, cannot speak — the oracles fail me."
    );
  } catch (err) {
    console.error("LLM error:", err);
    return "Even I, Alexander, cannot speak — the oracles fail me.";
  }
}
