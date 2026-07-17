// website/lib/ai/session.ts

import type {
  AIConversationSession,
  AIConversationState,
  AIIntent,
  AIMessage,
  AppointmentData,
  PatientData,
  ConversationAnalysis,
} from "./core";

const sessions = new Map<string, AIConversationSession>();

function now(): string {
  return new Date().toISOString();
}

/**
 * Creates a new conversation session.
 */
export function createSession(
  callId: string,
): AIConversationSession {
  const existing = sessions.get(callId);

  if (existing) {
    return existing;
  }

  const session: AIConversationSession = {
    id: crypto.randomUUID(),

    callId,

    /**
     * RC4 Compatibility
     */
    callSid: callId,

    /**
     * Conversation State
     */
    state: "greeting",

    intent: "unknown",

    /**
     * Conversation Data
     */
    patient: {},

    appointment: {
      confirmed: false,
    },

    messages: [],

    analysis: undefined,

    /**
     * Sprint C1
     */
    missingFields: [],

    currentStep: "greeting",

    confidence: 1,

    completed: false,

    needsHuman: false,

    createdAt: now(),

    updatedAt: now(),
  };

  sessions.set(callId, session);

  return session;
}

/**
 * Returns an existing session
 * or creates a new one.
 */
export function getSession(
  callId: string,
): AIConversationSession {
  return (
    sessions.get(callId) ??
    createSession(callId)
  );
}

/**
 * Persists session changes.
 */
export function saveSession(
  session: AIConversationSession,
): void {
  session.updatedAt = now();

  sessions.set(
    session.callId,
    session,
  );
}

/**
 * Removes a session.
 */
export function deleteSession(
  callId: string,
): boolean {
  return sessions.delete(callId);
}

/**
 * Adds a conversation message.
 */
export function addMessage(
  callId: string,
  message: AIMessage,
): void {
  const session =
    getSession(callId);

  session.messages.push(message);

  saveSession(session);
}

/**
 * Updates patient information.
 */
export function updatePatient(
  callId: string,
  patient: Partial<PatientData>,
): void {
  const session =
    getSession(callId);

  session.patient = {
    ...session.patient,
    ...patient,
  };

  saveSession(session);
}

/**
 * Updates appointment information.
 */
export function updateAppointment(
  callId: string,
  appointment: Partial<AppointmentData>,
): void {
  const session =
    getSession(callId);

  session.appointment = {
    ...session.appointment,
    ...appointment,
  };

  saveSession(session);
}

/**
 * Updates workflow state.
 */
export function updateState(
  callId: string,
  state: AIConversationState,
): void {
  const session =
    getSession(callId);

  session.state = state;

  saveSession(session);
}

/**
 * Updates detected intent.
 */
export function updateIntent(
  callId: string,
  intent: AIIntent,
): void {
  const session =
    getSession(callId);

  session.intent = intent;

  saveSession(session);
}

/**
 * Stores the latest AI analysis.
 */
export function updateAnalysis(
  callId: string,
  analysis: ConversationAnalysis,
): void {
  const session =
    getSession(callId);

  session.analysis = analysis;

  saveSession(session);
}

/**
 * Updates missing fields.
 */
export function setMissingFields(
  callId: string,
  fields: string[],
): void {
  const session =
    getSession(callId);

  session.missingFields = fields;

  saveSession(session);
}

/**
 * Updates the current conversation step.
 */
export function setCurrentStep(
  callId: string,
  step: string,
): void {
  const session =
    getSession(callId);

  session.currentStep = step;

  saveSession(session);
}

/**
 * Updates AI confidence.
 */
export function setConfidence(
  callId: string,
  confidence: number,
): void {
  const session =
    getSession(callId);

  session.confidence = confidence;

  saveSession(session);
}

/**
 * Marks conversation as completed.
 */
export function markCompleted(
  callId: string,
): void {
  const session =
    getSession(callId);

  session.completed = true;

  session.endedAt = now();

  saveSession(session);
}

/**
 * Requests human handoff.
 */
export function requestHumanTransfer(
  callId: string,
): void {
  const session =
    getSession(callId);

  session.needsHuman = true;

  saveSession(session);
}

/**
 * Returns every active session.
 */
export function getAllSessions(): AIConversationSession[] {
  return [...sessions.values()];
}

/**
 * Clears all active sessions.
 */
export function clearSessions(): void {
  sessions.clear();
}