// website/lib/ai/execution/transcript.ts

import type { AIMessage } from "../core";

/**
 * ============================================================
 * PatientPilot AI
 * RC5 Execution Engine
 * Conversation Transcript Builder
 * ============================================================
 *
 * Converts the internal AIMessage history into a
 * plain-text conversation transcript for the
 * OpenAI Responses API.
 */

/**
 * Human-readable labels for each speaker.
 */
function getSpeakerLabel(
  message: AIMessage,
): string {
  switch (message.speaker) {
    case "patient":
      return "Patient";

    case "assistant":
      return "Receptionist";

    case "system":
      return "System";

    default:
      return "Unknown";
  }
}

/**
 * Build a conversation transcript.
 */
export function buildConversationTranscript(
  messages: AIMessage[],
): string {
  if (messages.length === 0) {
    return "No previous conversation.";
  }

  return messages
    .map((message) => {
      const speaker = getSpeakerLabel(message);

      return `${speaker}: ${message.content}`;
    })
    .join("\n\n");
}

/**
 * Append the latest patient utterance.
 */
export function appendLatestMessage(
  transcript: string,
  latestMessage: string,
): string {
  const message = latestMessage.trim();

  if (!message) {
    return transcript;
  }

  if (!transcript) {
    return `Patient: ${message}`;
  }

  return `${transcript}\n\nPatient: ${message}`;
}