import type {
  AIConversationSession,
  AIConversationState,
  AIIntent,
  AIMessage,
  AppointmentData,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Session Manager
 * ============================================================
 */

const sessions = new Map<string, AIConversationSession>();

function now(): string {
  return new Date().toISOString();
}

/**
 * Create a new conversation session.
 */
export function createSession(
  callSid: string
): AIConversationSession {
  const existing = sessions.get(callSid);

  if (existing) {
    return existing;
  }

  const session: AIConversationSession = {
    callSid,

    state: "greeting",

    intent: "unknown",

    messages: [],

    appointment: {},

    createdAt: now(),

    updatedAt: now(),
  };

  sessions.set(callSid, session);

  return session;
}

/**
 * Get an existing session.
 */
export function getSession(
  callSid: string
): AIConversationSession {
  const session = sessions.get(callSid);

  if (!session) {
    return createSession(callSid);
  }

  return session;
}

/**
 * Save session.
 */
export function saveSession(
  session: AIConversationSession
): void {
  session.updatedAt = now();

  sessions.set(session.callSid, session);
}

/**
 * Delete session.
 */
export function deleteSession(
  callSid: string
): boolean {
  return sessions.delete(callSid);
}

/**
 * Add conversation message.
 */
export function addMessage(
  callSid: string,
  role: AIMessage["role"],
  content: string
): void {
  const session = getSession(callSid);

  session.messages.push({
    role,
    content,
  });

  session.updatedAt = now();

  saveSession(session);
}

/**
 * Update conversation state.
 */
export function updateState(
  callSid: string,
  state: AIConversationState
): void {
  const session = getSession(callSid);

  session.state = state;

  session.updatedAt = now();

  saveSession(session);
}

/**
 * Update detected intent.
 */
export function updateIntent(
  callSid: string,
  intent: AIIntent
): void {
  const session = getSession(callSid);

  session.intent = intent;

  session.updatedAt = now();

  saveSession(session);
}

/**
 * Merge appointment information.
 */
export function updateAppointment(
  callSid: string,
  appointment: Partial<AppointmentData>
): void {
  const session = getSession(callSid);

  session.appointment = {
    ...session.appointment,
    ...appointment,
  };

  session.updatedAt = now();

  saveSession(session);
}

/**
 * Conversation history.
 */
export function getConversationHistory(
  callSid: string
): AIMessage[] {
  return getSession(callSid).messages;
}

/**
 * Active session count.
 */
export function getActiveSessionCount(): number {
  return sessions.size;
}

/**
 * All active sessions.
 */
export function getAllSessions(): AIConversationSession[] {
  return [...sessions.values()];
}

/**
 * Remove every session.
 * Useful during development/testing.
 */
export function clearSessions(): void {
  sessions.clear();
}