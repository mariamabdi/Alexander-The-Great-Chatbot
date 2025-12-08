import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
// Generate a persistent session ID for this user
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15); // simple unique ID
    localStorage.setItem("sessionId", sessionId);
  }

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load start message from backend
  useEffect(() => {
    async function loadStart() {
      try {
        const res = await fetch("http://localhost:9990/api/start");
        const data = await res.json();
        setMessages([{ text: data.botMessage, isUser: false }]);
      } catch (err) {
        console.error("Start message error:", err);
      }
    }
    loadStart();
  }, []);

  // Send message to backend
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { text: inputText, isUser: true };
    setMessages((m) => [...m, userMsg]);

    try {
      const res = await fetch("http://localhost:9990/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          sessionId: sessionId
        })
      });

      const data = await res.json();
      const botMsg = { text: data.botMessage, isUser: false };
      setMessages((m) => [...m, botMsg]);

    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [
        ...m,
        { text: "Backend error — cannot connect.", isUser: false }
      ]);
    }

    setInputText("");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Alexander the Great Chatbot</h1>
      </header>

      <div className="chat-window">
        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.isUser ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Alexander anything..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;