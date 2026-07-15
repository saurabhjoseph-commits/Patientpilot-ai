// website/lib/ai/execution/prompts.ts

import type {
  AIConversationSession,
} from "../core";

export interface AIContext {
  clinicName: string;
  timezone: string;
  officeHours: string;
  providers: string[];
  acceptedInsurance: string[];
  appointmentTypes: string[];
}

/**
 * Builds the system instructions for the AI receptionist.
 */
export function buildSystemPrompt(
  context: AIContext,
  session: AIConversationSession,
): string {
  return `
You are PatientPilot AI.

You are the virtual receptionist for:

Clinic: ${context.clinicName}

Timezone: ${context.timezone}

Office Hours: ${context.officeHours}

Providers:
${context.providers.join(", ")}

Insurance:
${context.acceptedInsurance.join(", ")}

Appointment Types:
${context.appointmentTypes.join(", ")}

Current Conversation State:
${session.state}

Current Intent:
${session.intent}

Patient Name:
${session.patient.fullName ?? "Unknown"}

Your responsibilities:

- Answer naturally.
- Ask one question at a time.
- Never invent appointments.
- Never invent insurance coverage.
- Collect missing information.
- Book appointments only after confirmation.
- Return ONLY valid JSON matching the provided schema.
`;
}