import conversationData from "../../services/conversationService.js";
import { askGroq } from "../../services/groqService.js";
import { getSession } from "../../services/sessionService.js";

export async function handleChat(req, res) {
  const { message, sessionId } = req.body;

  const session = getSession(sessionId);

  let state = session.currentState;
  const states = conversationData.conversationStates;

  // Safety reset
  if (!states[state]) {
    state = "start";
    session.currentState = "start";
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

  if (match) {
    const next = match.nextState;
    session.currentState = next;

    const nextObj = states[next];

    let botReply =
      nextObj.botMessage.type === "random"
        ? nextObj.botMessage.messages[
            Math.floor(Math.random() * nextObj.botMessage.messages.length)
          ]
        : nextObj.botMessage;

    return res.json({
      botMessage: match.responseText + "\n\n" + botReply,
      nextState: next,
    });
  }

  // Fallback
  const aiReply = await askGroq(message);

  res.json({
    botMessage:
      (stateObj.fallbackMessage || "I do not understand your words.") +
      "\n\n" +
      aiReply,
    nextState: state,
  });
}
