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

    state: "greeting",

    intent: "unknown",

    patient: {},

    appointment: {
      confirmed: false,
    },

    messages: [],

    createdAt: now(),

    updatedAt: now(),
  };

  sessions.set(callId, session);

  return session;
}

export function getSession(
  callId: string,
): AIConversationSession {
  return (
    sessions.get(callId) ??
    createSession(callId)
  );
}

export function saveSession(
  session: AIConversationSession,
): void {
  session.updatedAt = now();

  sessions.set(
    session.callId,
    session,
  );
}

export function deleteSession(
  callId: string,
): boolean {
  return sessions.delete(callId);
}

export function addMessage(
  callId: string,
  message: AIMessage,
): void {
  const session =
    getSession(callId);

  session.messages.push(message);

  saveSession(session);
}

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

export function updateState(
  callId: string,
  state: AIConversationState,
): void {
  const session =
    getSession(callId);

  session.state = state;

  saveSession(session);
}

export function updateIntent(
  callId: string,
  intent: AIIntent,
): void {
  const session =
    getSession(callId);

  session.intent = intent;

  saveSession(session);
}

export function updateAnalysis(
  callId: string,
  analysis: ConversationAnalysis,
): void {
  const session =
    getSession(callId);

  session.analysis = analysis;

  saveSession(session);
}

export function getAllSessions() {
  return [...sessions.values()];
}

export function clearSessions() {
  sessions.clear();
}