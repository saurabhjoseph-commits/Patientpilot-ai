import type {
  LiveCall,
  LiveCallEvent,
  LiveCallStatus,
  TokenUsage,
  TranscriptMessage,
} from "@/types/live-monitor";

import type {
  AIConversationState,
  AIIntent,
} from "@/lib/ai/types";

/**
 * ============================================================
 * PatientPilot AI
 * Live Conversation Monitor
 * ============================================================
 */

const activeCalls = new Map<string, LiveCall>();

function now(): string {
  return new Date().toISOString();
}

function createTokenUsage(): TokenUsage {
  return {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  };
}

export function createLiveCall(
  callSid: string,
  from: string,
  to: string
): LiveCall {
  const timestamp = now();

  const call: LiveCall = {
    callSid,
    from,
    to,

    status: "ringing",

    aiState: "greeting",

    intent: "unknown",

    startedAt: timestamp,
    updatedAt: timestamp,

    durationSeconds: 0,

    transcript: [],

    events: [],

    tokenUsage: createTokenUsage(),

    error: null,
  };

  activeCalls.set(callSid, call);

  return call;
}

export function getLiveCall(
  callSid: string
): LiveCall | undefined {
  return activeCalls.get(callSid);
}

export function getAllLiveCalls(): LiveCall[] {
  return [...activeCalls.values()];
}

export function removeLiveCall(
  callSid: string
): boolean {
  return activeCalls.delete(callSid);
}

export function clearLiveCalls(): void {
  activeCalls.clear();
}

export function updateCallStatus(
  callSid: string,
  status: LiveCallStatus
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.status = status;
  call.updatedAt = now();
}

export function updateAIState(
  callSid: string,
  state: AIConversationState
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.aiState = state;
  call.updatedAt = now();
}

export function updateIntent(
  callSid: string,
  intent: AIIntent
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.intent = intent;
  call.updatedAt = now();
}

export function updateDuration(
  callSid: string,
  durationSeconds: number
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.durationSeconds = durationSeconds;
  call.updatedAt = now();
}

export function updateTokenUsage(
  callSid: string,
  usage: Partial<TokenUsage>
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.tokenUsage = {
    ...call.tokenUsage,
    ...usage,
  };

  call.updatedAt = now();
}

export function addTranscriptMessage(
  callSid: string,
  speaker: TranscriptMessage["speaker"],
  text: string
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.transcript.push({
    id: crypto.randomUUID(),
    speaker,
    text,
    timestamp: now(),
  });

  call.updatedAt = now();
}

export function addEvent(
  callSid: string,
  event: Omit<LiveCallEvent, "id" | "timestamp">
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.events.push({
    id: crypto.randomUUID(),
    timestamp: now(),
    ...event,
  });

  call.updatedAt = now();
}

export function setCallError(
  callSid: string,
  message: string
): void {
  const call = activeCalls.get(callSid);

  if (!call) return;

  call.error = message;
  call.updatedAt = now();

  addEvent(callSid, {
    type: "error",
    title: "Error",
    description: message,
  });
}

export function getActiveCallCount(): number {
  return activeCalls.size;
}

export function getCompletedCallCount(): number {
  return getAllLiveCalls().filter(
    (call) => call.status === "completed"
  ).length;
}

export function getFailedCallCount(): number {
  return getAllLiveCalls().filter(
    (call) => call.status === "failed"
  ).length;
}