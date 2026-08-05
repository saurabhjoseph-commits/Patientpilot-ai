/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a single interaction or event within the CRM.
 * Activities provide a unified timeline across leads,
 * opportunities, patients, customers, appointments,
 * communications, and AI interactions.
 */

export type ActivityType =
  | "call"
  | "sms"
  | "email"
  | "whatsapp"
  | "meeting"
  | "appointment"
  | "note"
  | "task"
  | "status_change"
  | "pipeline_change"
  | "ai_conversation"
  | "document"
  | "system"
  | "other";

export type ActivityDirection =
  | "inbound"
  | "outbound"
  | "internal";

export type ActivityStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "failed";

export interface ActivityRelatedEntity {

  leadId?: string;

  opportunityId?: string;

  patientId?: string;

  customerId?: string;

  appointmentId?: string;

  conversationId?: string;

  messageId?: string;

  taskId?: string;

}

export interface ActivityActor {

  userId?: string;

  aiAgentId?: string;

  patientId?: string;

  system?: boolean;

}

export interface ActivityMetadata {

  title: string;

  description?: string;

  tags: string[];

  externalId?: string;

}

export interface Activity {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  type: ActivityType;

  direction: ActivityDirection;

  status: ActivityStatus;

  related: ActivityRelatedEntity;

  actor: ActivityActor;

  metadata: ActivityMetadata;

  occurredAt: string;

  createdAt: string;

}