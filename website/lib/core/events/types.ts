/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Event Types
 * ============================================================
 */

import type { Event } from "./Event";

/**
 * Platform event names.
 */
export const EVENT_TYPES = {
  // Communication
  MESSAGE_RECEIVED: "MessageReceived",
  MESSAGE_SENT: "MessageSent",

  // Conversation
  CONVERSATION_STARTED: "ConversationStarted",
  CONVERSATION_ENDED: "ConversationEnded",

  // Patient
  PATIENT_CREATED: "PatientCreated",
  PATIENT_UPDATED: "PatientUpdated",

  // Appointment
  APPOINTMENT_BOOKED: "AppointmentBooked",
  APPOINTMENT_CANCELLED: "AppointmentCancelled",
  APPOINTMENT_RESCHEDULED: "AppointmentRescheduled",

  // Workflow
  WORKFLOW_STARTED: "WorkflowStarted",
  WORKFLOW_COMPLETED: "WorkflowCompleted",
  WORKFLOW_FAILED: "WorkflowFailed",

  // Clinic
  CLINIC_CREATED: "ClinicCreated",
  CLINIC_UPDATED: "ClinicUpdated",

  // AI
  AI_RESPONSE_GENERATED: "AIResponseGenerated",

  // CRM
  LEAD_CREATED: "LeadCreated",
  LEAD_CONVERTED: "LeadConverted",

  // Knowledge Base
  KNOWLEDGE_UPDATED: "KnowledgeUpdated",
} as const;

/**
 * Union of all supported event names.
 */
export type EventType =
  typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

/**
 * Generic event handler.
 */
export type EventHandler<
  TPayload = unknown
> = (
  event: Event<TPayload>
) => void | Promise<void>;

/**
 * List of handlers.
 */
export type EventHandlers<
  TPayload = unknown
> = EventHandler<TPayload>[];

/**
 * Event listener registry.
 */
export type EventRegistry = Partial<
  Record<EventType, EventHandlers>
>;