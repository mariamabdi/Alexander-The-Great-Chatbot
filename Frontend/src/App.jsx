import React, { useState, useEffect, useRef } from "react";
import "./style.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize sessionId
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load start message
  useEffect(() => {
    if (!sessionId) return;
    async function loadStart() {
      try {
        const res = await fetch("http://localhost:9990/api/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        setMessages([{ text: data.botMessage, isUser: false }]);
      } catch (err) {
        console.error("Start message error:", err);
      }
    }
    loadStart();
  }, [sessionId]);

  // Send message
  const sendMessage = async () => {
    if (!inputText.trim() || !sessionId) return;

    const userMsg = { text: inputText, isUser: true };
    setMessages((m) => [...m, userMsg]);

    try {
      const res = await fetch("http://localhost:9990/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText, sessionId }),
      });

      const data = await res.json();
      const botMsg = { text: data.botMessage, isUser: false };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [
        ...m,
        { text: "Backend error — cannot connect.", isUser: false },
      ]);
    }

    setInputText("");
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="top-bar">
        <h1>Alexander the Great</h1>
        <button
          className="restart-btn"
          onClick={() => {
            setMessages([]);
            localStorage.removeItem("sessionId");
            setSessionId(null);
          }}
        >
          RESTART
        </button>
      </header>

      {/* Navigation */}
      <nav className="sub-nav">
        <a href="#" className="nav-link">Menu</a>
        <a href="#" className="nav-link">About Us</a>
        <a href="#" className="nav-link">Contact</a>
      </nav>

      {/* Main Chat Area */}
      <main className="chat-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-box ${msg.isUser ? "user" : "alexander"}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Footer */}
      <footer className="input-bar">
        <input
          type="text"
          placeholder="Ask Alexander a question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>➤</button>
      </footer>
    </>
  );
}

export default App;
