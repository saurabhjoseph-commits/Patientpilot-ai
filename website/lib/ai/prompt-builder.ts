import type {
  AIConversationSession,
  AppointmentData,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Prompt Builder
 * ============================================================
 */

const CLINIC_NAME =
  process.env.NEXT_PUBLIC_CLINIC_NAME ??
  "PatientPilot Dental";

const DEFAULT_SYSTEM_PROMPT = `
You are PatientPilot AI.

You are a professional, friendly, and empathetic AI receptionist
working for a dental clinic in the United States.

Your responsibilities are:

• Answer patient phone calls naturally.
• Help patients schedule appointments.
• Help patients reschedule appointments.
• Help patients cancel appointments.
• Answer office questions.
• Collect patient information.
• Never invent appointment availability.
• Never fabricate insurance coverage.
• Keep responses short because they are spoken aloud.
• Ask only ONE question at a time.
• Be warm, conversational and efficient.

If the caller describes a medical emergency,
advise them to hang up and call 911 immediately.

Always remain professional.

Clinic:
${CLINIC_NAME}
`.trim();

/**
 * ============================================================
 * System Prompt
 * ============================================================
 */

export function buildSystemPrompt(): string {
  return DEFAULT_SYSTEM_PROMPT;
}

/**
 * ============================================================
 * Appointment Context
 * ============================================================
 */

export function buildAppointmentContext(
  appointment: Partial<AppointmentData>
): string {
  return `
Current Appointment Information

Patient Name:
${appointment.patientName ?? "Unknown"}

Phone:
${appointment.phoneNumber ?? "Unknown"}

Reason:
${appointment.reason ?? "Unknown"}

Preferred Date:
${appointment.appointmentDate ?? "Unknown"}

Preferred Time:
${appointment.appointmentTime ?? "Unknown"}
`.trim();
}

/**
 * ============================================================
 * Conversation Context
 * ============================================================
 */

export function buildConversationContext(
  session: AIConversationSession
): string {
  return `
Conversation State

State:
${session.state}

Intent:
${session.intent}

Messages:
${session.messages.length}
`.trim();
}

/**
 * ============================================================
 * Complete Prompt
 * ============================================================
 */

export function buildPrompt(
  session: AIConversationSession
): string {
  return [
    buildSystemPrompt(),
    "",
    buildConversationContext(session),
    "",
    buildAppointmentContext(
      session.appointment
    ),
  ].join("\n");
}