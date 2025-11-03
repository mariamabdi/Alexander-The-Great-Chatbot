import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Alexander backend is running!' });
});


app.post('/api/chat', (req, res) => {
  console.log('Chat route called!'); 
  res.json({ 
    botMessage: "Hail! I am Alexander. My server is working!",
    nextState: "start"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});