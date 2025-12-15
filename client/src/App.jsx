import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import alexanderImg from "./assets/alexander.png";

function App() {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Load or create sessionId
  useEffect(() => {
    let storedId = localStorage.getItem("sessionId");
    if (!storedId) {
      storedId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sessionId", storedId);
    }
    setSessionId(storedId);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load START message + options
  useEffect(() => {
    if (!sessionId) return;

    async function loadStart() {
      try {
        const res = await fetch("http://localhost:9990/api/start");
        const data = await res.json();

        setMessages([{ text: data.botMessage, isUser: false }]);
        setOptions(data.options || []);
      } catch (err) {
        console.error("Start error:", err);
      }
    }

    loadStart();
  }, [sessionId]);

  // Send message (user or option)
  const sendMessage = async (textOverride) => {
    const messageToSend = textOverride || inputText;
    if (!messageToSend.trim() || !sessionId) return;

    setOptions([]);

    setMessages((prev) => [...prev, { text: messageToSend, isUser: true }]);

    try {
      const res = await fetch("http://localhost:9990/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          sessionId,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.botMessage, isUser: false },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Backend error — cannot connect.", isUser: false },
      ]);
    }

    setInputText("");
  };

  const handleOptionClick = (optionText) => {
    sendMessage(optionText);
  };

  return (
    <>
      <header className="top-bar">
        <h1>Alexander The Great Chatbot</h1>
        <button
          className="restart-btn"
          onClick={() => {
            localStorage.removeItem("sessionId");
            window.location.reload();
          }}
        >
          RESTART
        </button>
      </header>
      {/* Secondary Header (NOT fixed) */}
<div className="profile-header">
  <img src={alexanderImg} alt="Alexander" className="profile-large" />
  <div className="profile-info">
    <h2>Alexander of Macedon</h2>
    <p>The Conqueror of Worlds</p>
  </div>
</div>


      <main className="chat-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-row ${msg.isUser ? "user-row" : "alexander-row"}`}
          >
            {!msg.isUser && (
              <img src={alexanderImg} alt="Alexander" className="alexander-pfp" />
            )}

            <div className={`message-box ${msg.isUser ? "user" : "alexander"}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {options.length > 0 && (
          <div className="options">
            {options.map((opt, i) => (
              <button
                key={i}
                className="option-bubble"
                onClick={() => handleOptionClick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="input-bar">
        <input
          type="text"
          placeholder="Ask Alexander a question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={() => sendMessage()}>
        <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="22"
    viewBox="0 0 29 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
        </button>
      </footer>
    </>
  );
}

export default App;
