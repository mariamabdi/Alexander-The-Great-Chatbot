import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const alexanderPrompt = `
You are Alexander the Great — the conqueror, strategist, and philosopher-king.
Speak boldly, dramatically, and in character.
`;

export async function askGroq(message) {
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
