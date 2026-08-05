/**
 * PP-004 Communication & Engagement Domain
 *
 * Represents a way to contact
 * a person or organization.
 *
 * Contact points belong to people,
 * not conversations.
 */

export type ContactPointOwnerType =
  | "patient"
  | "lead"
  | "customer"
  | "provider"
  | "staff"
  | "clinic"
  | "organization"
  | "external";

export type ContactPointType =
  | "phone"
  | "mobile"
  | "email"
  | "whatsapp"
  | "patient_portal"
  | "web_chat"
  | "fax"
  | "custom";

export type ContactPointPurpose =
  | "primary"
  | "home"
  | "work"
  | "billing"
  | "emergency"
  | "marketing"
  | "support"
  | "other";

export type ContactPointStatus =
  | "active"
  | "inactive"
  | "unverified"
  | "verified"
  | "blocked";

export interface ContactPointOwner {

  ownerType: ContactPointOwnerType;

  ownerId: string;

}

export interface ContactPointValue {

  value: string;

  normalizedValue?: string;

}

export interface ContactPointVerification {

  verified: boolean;

  verifiedAt?: string;

  verificationMethod?: string;

}

export interface ContactPointPreferences {

  preferred: boolean;

  priority: number;

}

export interface ContactPointMetadata {

  notes?: string;

  externalId?: string;

}

export interface ContactPoint {

  id: string;

  tenantId: string;

  clinicId: string;

  type: ContactPointType;

  purpose: ContactPointPurpose;

  status: ContactPointStatus;

  owner: ContactPointOwner;

  contact: ContactPointValue;

  verification: ContactPointVerification;

  preferences: ContactPointPreferences;

  metadata: ContactPointMetadata;

  createdAt: string;

  updatedAt: string;

}