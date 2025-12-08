import React from 'react';
import './style.css';

const AlexanderChat = () => {
  return (
    <>
      {/* Add Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" 
        rel="stylesheet" 
      />

      {/* Header Section */}
      <header className="top-bar">
        <h1>Alexander the Great</h1>
        <button className="restart-btn">RESTART</button>
      </header>

      {/* Navigation */}
      <nav className="sub-nav">
        <a href="#" className="nav-link">Menu</a>
        <a href="#" className="nav-link">About Us</a>
        <a href="#" className="nav-link">Contact</a>
      </nav>
      
      {/* Main Chat Area */}
      <main className="chat-container">
        {/* Alexander's Message */}
        <div className="message-box alexander">
          <p>I am Alexander, son of Philip. What knowledge you seek of my conquests?</p>
          <div className="options">
            <button>Tell me more</button>
            <button>Where is Persia?</button>
          </div>
        </div>

        {/* User's Message */}
        <div className="message-box user">
          <p>Tell me about the Battle of Gaugamela</p>
        </div>
      </main>

      {/* Input Footer */}
      <footer className="input-bar">
        <input type="text" placeholder="Ask Alexander a question..." />
        <button className="send-btn">➤</button>
      </footer>
    </>
  );
};

export default AlexanderChat;