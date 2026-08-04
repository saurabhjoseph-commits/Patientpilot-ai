/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents an attachment associated
 * with a communication message.
 */

export type MessageAttachmentStatus =
  | "uploading"
  | "available"
  | "quarantined"
  | "blocked"
  | "deleted";

export type MessageAttachmentType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "other";

export interface MessageAttachmentStorage {

  provider: string;

  bucket?: string;

  objectKey?: string;

  url?: string;

}

export interface MessageAttachmentSecurity {

  scanned: boolean;

  infected: boolean;

  encrypted: boolean;

  downloadable: boolean;

}

export interface MessageAttachmentMetadata {

  fileName: string;

  mimeType: string;

  fileSizeBytes: number;

  checksum?: string;

  width?: number;

  height?: number;

  durationSeconds?: number;

  pageCount?: number;

  tags: string[];

}

export interface MessageAttachment {

  id: string;

  tenantId: string;

  messageId: string;

  documentId?: string;

  status: MessageAttachmentStatus;

  type: MessageAttachmentType;

  storage: MessageAttachmentStorage;

  security: MessageAttachmentSecurity;

  metadata: MessageAttachmentMetadata;

  uploadedAt?: string;

  createdAt: string;

  updatedAt: string;

}