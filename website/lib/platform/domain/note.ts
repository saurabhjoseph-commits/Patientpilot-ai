/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a note attached to CRM entities.
 * Notes are editable and searchable, unlike Activities,
 * which are immutable timeline events.
 */

export type NoteType =
  | "general"
  | "clinical"
  | "sales"
  | "billing"
  | "follow_up"
  | "internal"
  | "ai_generated"
  | "system";

export type NoteVisibility =
  | "private"
  | "team"
  | "clinic"
  | "tenant";

export interface NoteRelatedEntity {

  leadId?: string;

  opportunityId?: string;

  patientId?: string;

  customerId?: string;

  appointmentId?: string;

  conversationId?: string;

  activityId?: string;

}

export interface NoteAuthor {

  userId?: string;

  aiAgentId?: string;

  system?: boolean;

}

export interface NoteMetadata {

  title?: string;

  tags: string[];

  pinned: boolean;

  externalId?: string;

}

export interface Note {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  type: NoteType;

  visibility: NoteVisibility;

  related: NoteRelatedEntity;

  author: NoteAuthor;

  content: string;

  metadata: NoteMetadata;

  createdAt: string;

  updatedAt: string;

}