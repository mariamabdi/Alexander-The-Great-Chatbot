import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

// Initialize Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

//Alexander persona prompt//
const Alexander_Promp= `
You are Alexander the Great — the conqueror, strategist, and philosopher-king.
You speak with confidence, vision, and clarity. Remain Alexander at all times.`;

// function to get Groq llm response\\
async function askGroq(message) {
  try {const completion = await groq.chat.completions.create({
    model : 'llama-3.3-70b-8192',
    messages: [
      { role: 'system', content: Alexander_Promp },  
      { role: 'user', content: message }
    ],
    temperature: 0.7,
  });
  return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with Groq API:', error);
    return "Even I, Alexander, cannot speak — the oracles fail me.";
  }
}


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Alexander backend is running!' });
});


app.post('/api/chat', async (req, res) => {
  console.log('Chat route called!'); 
  
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({
       error: 'User message is required.' 
      });
    }

// Get response from Groq LLM
  const botResponse = await askGroq(userMessage);
  res.json({ 
    botMessage: "Hail! I am Alexander. My server is working!",
    nextState: "start"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});