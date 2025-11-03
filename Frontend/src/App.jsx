import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      // Send to backend
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText })
      });
      
      const data = await response.json();
      
      // Add bot response to chat
      const botMessage = { text: data.botMessage, isUser: false };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      const errorMessage = { text: "Cannot reach Alexander's war council!", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Alexander the Great Chatbot</h1>
        <p>Converse with the legendary conqueror</p>
      </header>

      <div className="chat-window">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
              {msg.text}
            </div>
          ))}
        </div>
        
        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Alexander a question..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;