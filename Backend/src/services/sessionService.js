const sessions = {};

export function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = { currentState: "start" };
  }
  return sessions[sessionId];
}
