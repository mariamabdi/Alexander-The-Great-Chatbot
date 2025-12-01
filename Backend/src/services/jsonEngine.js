import fs from 'fs';

console.log('JSON ENGINE LOADING...'); 

const conversationData = JSON.parse(
  fs.readFileSync('./data/conversation.json', 'utf8')
);

console.log(' JSON LOADED - Nodes:', Object.keys(conversationData.conversationStates)); 

export function processMessage(userInput, currentState = 'start') {
  console.log('PROCESSING:', userInput, 'State:', currentState); 
  
  const node = conversationData.conversationStates[currentState];
  
  if (!node) {
    console.log('NODE NOT FOUND:', currentState); 
    return {
      botMessage: "My mind wanders... Let us begin anew.",
      nextState: "start"
    };
  }

  const input = userInput.toLowerCase();
  const matchedOption = node.userOptions.find(option =>
    option.userInput.some(keyword => input.includes(keyword.toLowerCase()))
  );

  if (matchedOption) {
    console.log('MATCH FOUND:', matchedOption.nextState);
    return {
      botMessage: matchedOption.responseText,
      nextState: matchedOption.nextState
    };
  } else {
    console.log(' NO MATCH - Fallback'); // ← ADD THIS
    return {
      botMessage: node.fallbackMessage,
      nextState: currentState
    };
  }
}
