import express from 'express';
const router = express.Router();

// will connect to JSON later
router.post('/chat', (req, res) => {
  const { message } = req.body;
  
  // Simple echo for now
  res.json({
    botMessage: `I am Alexander! You said: "${message}". My JSON brain is not connected yet.`,
    nextState: "start"
  });
});

export default router;