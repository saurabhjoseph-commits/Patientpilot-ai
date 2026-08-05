/**
 * PP-004 Communication & Engagement Domain
 *
 * Aggregate root representing
 * a legal or business consent
 * granted by a person or organization.
 */

export type ConsentOwnerType =
  | "patient"
  | "lead"
  | "customer"
  | "provider"
  | "staff"
  | "guardian"
  | "organization";

export type ConsentCategory =
  | "treatment"
  | "communication"
  | "sms"
  | "email"
  | "marketing"
  | "call_recording"
  | "ai_interaction"
  | "telehealth"
  | "insurance"
  | "data_sharing"
  | "research"
  | "privacy"
  | "other";

export type ConsentStatus =
  | "draft"
  | "granted"
  | "declined"
  | "revoked"
  | "expired";

export type ConsentMethod =
  | "written"
  | "electronic"
  | "verbal"
  | "sms"
  | "email"
  | "patient_portal"
  | "api"
  | "staff";

export interface ConsentOwner {

  ownerType: ConsentOwnerType;

  ownerId: string;

}

export interface ConsentValidity {

  grantedAt?: string;

  effectiveFrom?: string;

  expiresAt?: string;

  revokedAt?: string;

}

export interface ConsentEvidence {

  method: ConsentMethod;

  documentId?: string;

  conversationId?: string;

  messageId?: string;

  witnessId?: string;

}

export interface ConsentVersion {

  version: number;

  previousConsentId?: string;

}

export interface ConsentMetadata {

  jurisdiction?: string;

  notes?: string;

  externalId?: string;

}

export interface Consent {

  id: string;

  tenantId: string;

  clinicId: string;

  category: ConsentCategory;

  status: ConsentStatus;

  owner: ConsentOwner;

  validity: ConsentValidity;

  evidence: ConsentEvidence;

  version: ConsentVersion;

  metadata: ConsentMetadata;

  createdAt: string;

  updatedAt: string;

}