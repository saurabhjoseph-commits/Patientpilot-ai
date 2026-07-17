// website/lib/ai/response/prompts.ts

import type {
  AIConversationSession,
  ConversationAnalysis,
} from "../core";

export function buildPrompt(
  session: AIConversationSession,
  analysis: ConversationAnalysis,
): string {
  return `
Conversation State:
${session.state}

Intent:
${analysis.intent}

Patient:
${JSON.stringify(session.patient, null, 2)}

Appointment:
${JSON.stringify(session.appointment, null, 2)}
`.trim();
}