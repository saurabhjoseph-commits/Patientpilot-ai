import type {
  AIConversationSession,
  AIConversationState,
  AIIntent,
  AppointmentData,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation Memory
 * ============================================================
 */

export interface MemoryEntity {
  key: string;
  value: string;
  confidence: number;
  updatedAt: string;
}

export interface ConversationMemory {
  /**
   * Canonical call identifier.
   */
  callId: string;

  currentState: AIConversationState;

  intent: AIIntent;

  appointment: AppointmentData;

  entities: MemoryEntity[];

  previousQuestion?: string;

  lastPatientMessage?: string;

  lastAIMessage?: string;

  missingFields: string[];

  confidence: number;

  turnCount: number;

  createdAt: string;

  updatedAt: string;
}

const memoryStore = new Map<string, ConversationMemory>();

function now(): string {
  return new Date().toISOString();
}

/**
 * Creates memory for a new call.
 */
export function createMemory(
  session: AIConversationSession,
): ConversationMemory {
  const existing = memoryStore.get(session.callId);

  if (existing) {
    return existing;
  }

  const memory: ConversationMemory = {
    callId: session.callId,

    currentState: session.state,

    intent: session.intent,

    appointment: {
      ...session.appointment,
    },

    entities: [],

    missingFields: [],

    confidence: 0,

    turnCount: 0,

    createdAt: now(),

    updatedAt: now(),
  };

  memoryStore.set(session.callId, memory);

  return memory;
}

/**
 * Returns memory for a call.
 *
 * Compatibility:
 * Existing callers still pass callSid.
 * Internally we treat it as the canonical callId.
 */
export function getMemory(
  callSid: string,
): ConversationMemory | undefined {
  return memoryStore.get(callSid);
}

/**
 * Creates memory if needed.
 */
export function ensureMemory(
  session: AIConversationSession,
): ConversationMemory {
  return (
    getMemory(session.callId) ??
    createMemory(session)
  );
}

/**
 * Saves memory.
 */
export function saveMemory(
  memory: ConversationMemory,
): void {
  memory.updatedAt = now();

  memoryStore.set(memory.callId, memory);
}

/**
 * Removes memory after call completion.
 */
export function deleteMemory(
  callSid: string,
): boolean {
  return memoryStore.delete(callSid);
}

/**
 * Updates conversation state.
 */
export function updateMemoryState(
  callSid: string,
  state: AIConversationState,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.currentState = state;

  saveMemory(memory);
}

/**
 * Updates detected intent.
 */
export function updateMemoryIntent(
  callSid: string,
  intent: AIIntent,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.intent = intent;

  saveMemory(memory);
}

/**
 * Stores extracted appointment information.
 */
export function updateAppointmentMemory(
  callSid: string,
  appointment: Partial<AppointmentData>,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.appointment = {
    ...memory.appointment,
    ...appointment,
  };

  saveMemory(memory);
}

/**
 * Stores the latest patient utterance.
 */
export function rememberPatientMessage(
  callSid: string,
  message: string,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.lastPatientMessage = message;

  memory.turnCount++;

  saveMemory(memory);
}

/**
 * Stores the latest AI response.
 */
export function rememberAIMessage(
  callSid: string,
  message: string,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.lastAIMessage = message;

  saveMemory(memory);
}

/**
 * Stores the last question asked.
 */
export function rememberQuestion(
  callSid: string,
  question: string,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.previousQuestion = question;

  saveMemory(memory);
}

/**
 * Updates missing fields.
 */
export function updateMissingFields(
  callSid: string,
  fields: string[],
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.missingFields = fields;

  saveMemory(memory);
}

/**
 * Updates confidence score.
 */
export function updateConfidence(
  callSid: string,
  confidence: number,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  memory.confidence = confidence;

  saveMemory(memory);
}

/**
 * Adds or updates an extracted entity.
 */
export function rememberEntity(
  callSid: string,
  key: string,
  value: string,
  confidence: number,
): void {
  const memory = getMemory(callSid);

  if (!memory) return;

  const existing = memory.entities.find(
    (entity) => entity.key === key,
  );

  if (existing) {
    existing.value = value;
    existing.confidence = confidence;
    existing.updatedAt = now();
  } else {
    memory.entities.push({
      key,
      value,
      confidence,
      updatedAt: now(),
    });
  }

  saveMemory(memory);
}

/**
 * Returns all active memories.
 */
export function getAllMemories(): ConversationMemory[] {
  return [...memoryStore.values()];
}