// website/lib/ai/core/message.ts

/**
 * ============================================================
 * PatientPilot AI
 * Message Domain Model
 * ============================================================
 */

export type MessageRole =
  | "system"
  | "user"
  | "assistant";

export type MessageSpeaker =
  | "system"
  | "assistant"
  | "patient";

export interface AIMessage {
  id: string;

  role: MessageRole;

  speaker: MessageSpeaker;

  content: string;

  timestamp: string;
}

/**
 * Backward compatibility alias.
 */
export type ConversationMessage = AIMessage;