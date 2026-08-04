/**
 * PP-003 Operations Domain
 *
 * Represents a clinical document created
 * during a clinical encounter.
 *
 * Clinical notes are immutable records.
 * Corrections should be represented as
 * amendments rather than modifying
 * historical notes.
 */

export type ClinicalNoteType =
  | "soap"
  | "progress"
  | "operative"
  | "consultation"
  | "discharge"
  | "referral"
  | "follow_up"
  | "other";

export type ClinicalNoteStatus =
  | "draft"
  | "completed"
  | "signed"
  | "amended";

export interface ClinicalNoteAuthor {

  providerId: string;

}

export interface ClinicalNoteContent {

  title?: string;

  body: string;

}

export interface ClinicalNoteSignature {

  signedAt?: string;

  signedBy?: string;

}

export interface ClinicalNoteReferences {

  encounterId: string;

  patientId: string;

  appointmentId?: string;

  treatmentPlanId?: string;

}

export interface ClinicalNoteMetadata {

  language?: string;

  aiGenerated?: boolean;

  aiReviewed?: boolean;

  externalId?: string;

}

export interface ClinicalNote {

  id: string;

  tenantId: string;

  clinicId: string;

  references: ClinicalNoteReferences;

  author: ClinicalNoteAuthor;

  type: ClinicalNoteType;

  status: ClinicalNoteStatus;

  content: ClinicalNoteContent;

  signature: ClinicalNoteSignature;

  metadata: ClinicalNoteMetadata;

  createdAt: string;

  updatedAt: string;

}