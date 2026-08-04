/**
 * PP-004 Communication & Engagement Domain
 *
 * Represents a file attached to
 * a conversation.
 *
 * Files are stored externally while
 * this entity stores metadata and
 * relationships.
 */

export type ConversationAttachmentType =
  | "image"
  | "document"
  | "pdf"
  | "audio"
  | "video"
  | "transcript"
  | "recording"
  | "xray"
  | "treatment_plan"
  | "insurance_document"
  | "consent_form"
  | "other";

export type ConversationAttachmentStatus =
  | "uploading"
  | "available"
  | "processing"
  | "archived"
  | "deleted";

export interface ConversationAttachmentReference {

  conversationId: string;

  messageId?: string;

}

export interface ConversationAttachmentFile {

  fileName: string;

  contentType: string;

  fileSize: number;

  storageKey: string;

  checksum?: string;

}

export interface ConversationAttachmentSecurity {

  encrypted: boolean;

  retentionUntil?: string;

}

export interface ConversationAttachmentMetadata {

  notes?: string;

  externalId?: string;

}

export interface ConversationAttachment {

  id: string;

  tenantId: string;

  clinicId: string;

  type: ConversationAttachmentType;

  status: ConversationAttachmentStatus;

  reference: ConversationAttachmentReference;

  file: ConversationAttachmentFile;

  security: ConversationAttachmentSecurity;

  metadata: ConversationAttachmentMetadata;

  createdAt: string;

  updatedAt: string;

}