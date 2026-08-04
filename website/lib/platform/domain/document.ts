/**
 * PP-002 Milestone A
 * Global Document Domain
 *
 * Represents a document or file managed by
 * PatientPilot AI.
 */

export type DocumentStatus =
  | "active"
  | "archived"
  | "deleted";

export type DocumentCategory =
  | "consent_form"
  | "insurance"
  | "treatment_plan"
  | "prescription"
  | "invoice"
  | "receipt"
  | "xray"
  | "clinical_image"
  | "patient_upload"
  | "ai_generated"
  | "report"
  | "other";

export type DocumentVisibility =
  | "private"
  | "staff"
  | "patient"
  | "shared";

export interface DocumentStorage {

  provider: string;

  bucket?: string;

  path: string;

  url?: string;

}

export interface DocumentReference {

  patientId?: string;

  appointmentId?: string;

  treatmentId?: string;

  conversationId?: string;

  taskId?: string;

}

export interface DocumentMetadata {

  mimeType: string;

  sizeBytes: number;

  checksum?: string;

  version?: number;

  externalId?: string;

}

export interface Document {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  status: DocumentStatus;

  category: DocumentCategory;

  visibility: DocumentVisibility;

  name: string;

  description?: string;

  storage: DocumentStorage;

  reference: DocumentReference;

  metadata: DocumentMetadata;

  tags: string[];

  uploadedBy?: string;

  createdAt: string;

  updatedAt: string;

}