README_PROJECT.md — Whole Chatbot (Client + Server)

------------------------------------------------------------
PROJECT OVERVIEW
------------------------------------------------------------
This project is a conversational chatbot that roleplays Alexander the Great.
It allows users to explore his military campaigns, philosophy, personal life,
and historical legacy through a guided, interactive dialogue.

The system is intentionally designed as a hybrid chatbot:
- A rule-based JSON state machine is used as the primary conversation engine
- A Large Language Model (LLM) is used only as a fallback when no predefined
  rule matches the user input

This approach ensures historical consistency, predictable interaction flow,
and controlled behaviour, while still allowing flexibility for open-ended
user input.

------------------------------------------------------------
ARCHITECTURE OVERVIEW
------------------------------------------------------------
The project is split into two main parts:

CLIENT (Frontend)
- Built with React
- Handles user interaction and presentation
- Sends messages to the backend API
- Displays structured chatbot responses and optional images

SERVER (Backend)
- Built with Node.js and Express
- Implements the JSON conversation logic
- Maintains per-session conversational state and short-term memory
- Uses the Groq API as an LLM fallback only when JSON logic fails

------------------------------------------------------------
KEY DESIGN PRINCIPLES
------------------------------------------------------------
- JSON-first conversation logic (deterministic and testable)
- LLM used strictly as a fallback, not as the primary system
- Clear separation of concerns (routes, controllers, services)
- Maintainable file structure and modular code
- Short-session conversational context rather than long-form study
- Interface designed to reduce cognitive load with guided options

------------------------------------------------------------
RUNNING THE PROJECT
------------------------------------------------------------
1. Clone Repo and open in VScode
2. From the /client directory:
   npm install
   npm run dev
3. From the /server directory:
   npm install
   npm start
The server runs on:
http://localhost:9990
5. Open the client in a web browser
6. Interact with the chatbot as Alexander the Great

------------------------------------------------------------
SUBMISSION NOTES
------------------------------------------------------------
- node_modules folders are excluded
- Source code is included (not build-only)
- Environment variables are documented using .env.example
- The application runs locally as required
- Code is documented using JSDoc for professionalism
