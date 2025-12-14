// sessionService.js

// In-memory session storage
const sessions = {};

/**
 * Retrieves the session object for a given sessionId.
 * If it doesn't exist yet, create a new session with default state.
 */
export function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      currentState: "start",
      history: []   
    };
  }
  return sessions[sessionId];
}

/**
 * Updates the current state of the session.
 * If the session doesn't exist, it creates a new one with the given state.
 */
export function updateSession(sessionId, nextState) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = { currentState: nextState };
  } else {
    sessions[sessionId].currentState = nextState;
  }
}

/**
 * Optional: Clear a session completely
 */
export function clearSession(sessionId) {
  delete sessions[sessionId];
}

/**
 * Optional: Get all sessions (for debugging)
 */
export function getAllSessions() {
  return sessions;
}
