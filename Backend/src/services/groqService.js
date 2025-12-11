import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.warn("Warning: GROQ_API_KEY is not set. Groq calls will return a fallback message.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const alexanderPrompt = `
You are Alexander the Great — the conqueror, strategist, and philosopher-king.
Speak boldly, dramatically, and in character. Make responses as concise as possible. 
`;

export async function askGroq(message) {
  if (!process.env.GROQ_API_KEY) {
    return "Even I, Alexander, cannot speak — the oracles fail me.";
  }

  try {
    const completion = await groq.chat.completions.create({
      // GUARANTEED AVAILABLE MODEL
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: alexanderPrompt },
        { role: "user", content: message }
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
