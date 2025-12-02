import express from 'express';
import { processMessage } from '../services/jsonEngine.js';

const router = express.Router();
const userSessions = {};

router.post('/chat', (req, res) => {
  const { message, sessionId = 'default' } = req.body;
  console.log('✅ JSON ENGINE CALLED - User said:', message);
  
  if (!userSessions[sessionId]) {
    userSessions[sessionId] = { currentState: 'start' };
  }
  
  const userSession = userSessions[sessionId];
  const result = processMessage(message, userSession.currentState);
  userSession.currentState = result.nextState;
  
  console.log('✅ JSON ENGINE RESPONSE:', result.botMessage);
  
  res.json({
    botMessage: result.botMessage,
    nextState: result.nextState
  });
});

export default router;
  
 