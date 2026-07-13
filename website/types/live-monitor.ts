/**
 * ============================================================
 * PatientPilot AI
 * Live Conversation Monitor Types
 * ============================================================
 */

import type {
  AIConversationState,
  AIIntent,
} from "@/lib/ai/types";

/**
 * Current status of the phone call.
 */
export type LiveCallStatus =
  | "ringing"
  | "connected"
  | "listening"
  | "thinking"
  | "speaking"
  | "completed"
  | "failed";

/**
 * Direction of a transcript message.
 */
export type TranscriptSpeaker =
  | "user"
  | "assistant"
  | "system";

/**
 * Individual transcript message.
 */
export interface TranscriptMessage {
  id: string;

  speaker: TranscriptSpeaker;

  text: string;

  timestamp: string;
}

/**
 * AI usage information.
 */
export interface TokenUsage {
  promptTokens: number;

  completionTokens: number;

  totalTokens: number;
}

/**
 * Timeline event shown in the dashboard.
 */
export interface LiveCallEvent {
  id: string;

  type:
    | "incoming"
    | "connected"
    | "listening"
    | "speech"
    | "thinking"
    | "response"
    | "appointment"
    | "completed"
    | "error";

  title: string;

  description?: string;

  timestamp: string;
}

/**
 * Active phone call displayed in the dashboard.
 */
export interface LiveCall {
  callSid: string;

  from: string;

  to: string;

  status: LiveCallStatus;

  aiState: AIConversationState;

  intent: AIIntent;

  startedAt: string;

  updatedAt: string;

  durationSeconds: number;

  transcript: TranscriptMessage[];

  events: LiveCallEvent[];

  tokenUsage: TokenUsage;

  error?: string | null;
}

/**
 * Dashboard summary.
 */
export interface LiveMonitorSummary {
  activeCalls: number;

  completedCalls: number;

  failedCalls: number;

  totalCalls: number;
}

/**
 * API response for the Live Monitor.
 */
export interface LiveMonitorResponse {
  success: boolean;

  summary: LiveMonitorSummary;

  calls: LiveCall[];

  generatedAt: string;
}