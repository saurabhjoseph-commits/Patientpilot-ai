/**
 * PP-004 Communication & Engagement Domain
 *
 * Aggregate root representing a conversation
 * between one or more participants across
 * one or more communication channels.
 *
 * Individual messages are modeled separately
 * as ConversationMessage.
 */

export type ConversationStatus =
  | "open"
  | "waiting_for_patient"
  | "waiting_for_clinic"
  | "resolved"
  | "closed"
  | "archived";

export type ConversationChannel =
  | "phone"
  | "sms"
  | "email"
  | "web_chat"
  | "patient_portal"
  | "mobile_app"
  | "whatsapp"
  | "api"
  | "other";

export type ConversationDirection =
  | "inbound"
  | "outbound";

export type ConversationOwnerType =
  | "ai_agent"
  | "staff"
  | "provider"
  | "system";

export interface ConversationParticipants {

  patientId?: string;

  customerId?: string;

  leadId?: string;

  providerId?: string;

}

export interface ConversationOwnership {

  ownerType: ConversationOwnerType;

  ownerId?: string;

}

export interface ConversationTimeline {

  startedAt: string;

  lastActivityAt: string;

  closedAt?: string;

}

export interface ConversationMetadata {

  subject?: string;

  tags?: string[];

  externalId?: string;

}

export interface Conversation {

  id: string;

  tenantId: string;

  clinicId: string;

  status: ConversationStatus;

  primaryChannel: ConversationChannel;

  direction: ConversationDirection;

  participants: ConversationParticipants;

  ownership: ConversationOwnership;

  timeline: ConversationTimeline;

  metadata: ConversationMetadata;

  createdAt: string;

  updatedAt: string;

}