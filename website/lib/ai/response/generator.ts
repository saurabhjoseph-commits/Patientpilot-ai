// website/lib/ai/response/generator.ts

import type {
  AIConversationSession,
  ConversationAnalysis,
} from "../core";

import { RESPONSE_TEMPLATES } from "./templates";

const DEFAULT_CLINIC_NAME = "PatientPilot AI";

export function generateResponse(
  session: AIConversationSession,
  analysis: ConversationAnalysis,
): string {
  const template =
    RESPONSE_TEMPLATES[analysis.intent];

  let message = template.message;

  message = message.replace(
    "{{clinicName}}",
    DEFAULT_CLINIC_NAME,
  );

  if (
    template.requiresName &&
    session.patient.fullName
  ) {
    return `Thanks ${session.patient.fullName}. ${message}`;
  }

  return message;
}