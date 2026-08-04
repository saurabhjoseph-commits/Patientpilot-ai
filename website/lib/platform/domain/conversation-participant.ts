/**
 * PP-004 Communication & Engagement Domain
 *
 * Represents a participant within
 * a conversation.
 *
 * Conversations may have multiple
 * participants joining and leaving
 * over time.
 */

export type ConversationParticipantType =
  | "patient"
  | "lead"
  | "customer"
  | "staff"
  | "provider"
  | "guardian"
  | "interpreter"
  | "ai_agent"
  | "system"
  | "external";

export type ConversationParticipantRole =
  | "owner"
  | "participant"
  | "observer"
  | "assistant"
  | "reviewer"
  | "translator"
  | "automation"
  | "other";

export type ConversationParticipantStatus =
  | "invited"
  | "active"
  | "inactive"
  | "removed";

export interface ConversationParticipantReference {

  conversationId: string;

}

export interface ConversationParticipantIdentity {

  participantType: ConversationParticipantType;

  participantId?: string;

  displayName?: string;

}

export interface ConversationParticipantPermissions {

  canRead: boolean;

  canWrite: boolean;

  canManage: boolean;

}

export interface ConversationParticipantTimeline {

  joinedAt: string;

  leftAt?: string;

}

export interface ConversationParticipantMetadata {

  notes?: string;

  externalId?: string;

}

export interface ConversationParticipant {

  id: string;

  tenantId: string;

  clinicId: string;

  status: ConversationParticipantStatus;

  role: ConversationParticipantRole;

  reference: ConversationParticipantReference;

  identity: ConversationParticipantIdentity;

  permissions: ConversationParticipantPermissions;

  timeline: ConversationParticipantTimeline;

  metadata: ConversationParticipantMetadata;

  createdAt: string;

  updatedAt: string;

}