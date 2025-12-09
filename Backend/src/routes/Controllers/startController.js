import conversationData from "../../services/conversationService.js";

export function startConversation(req, res) {
  const start = conversationData.conversationStates.start;

  let msg =
    start.botMessage.type === "random"
      ? start.botMessage.messages[
          Math.floor(Math.random() * start.botMessage.messages.length)
        ]
      : start.botMessage;

  res.json({ botMessage: msg });
}
