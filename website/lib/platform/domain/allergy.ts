/**
 * PP-003 Operations Domain
 *
 * Represents a patient allergy or intolerance.
 *
 * Allergies are maintained independently from
 * MedicalHistory because they have their own
 * lifecycle and are critical for clinical
 * decision support.
 */

export type AllergyCategory =
  | "drug"
  | "food"
  | "environment"
  | "material"
  | "biologic"
  | "other";

export type AllergySeverity =
  | "mild"
  | "moderate"
  | "severe"
  | "life_threatening"
  | "unknown";

export type AllergyVerificationStatus =
  | "unconfirmed"
  | "confirmed"
  | "refuted"
  | "entered_in_error";

export type AllergyClinicalStatus =
  | "active"
  | "inactive"
  | "resolved";

export interface AllergyPatient {

  patientId: string;

}

export interface AllergySubstance {

  code?: string;

  name: string;

}

export interface AllergyReaction {

  description?: string;

  severity: AllergySeverity;

}

export interface AllergyVerification {

  status: AllergyVerificationStatus;

  verifiedAt?: string;

  verifiedBy?: string;

}

export interface AllergyMetadata {

  recordedDate?: string;

  onsetDate?: string;

  notes?: string;

  externalId?: string;

}

export interface Allergy {

  id: string;

  tenantId: string;

  clinicId: string;

  patient: AllergyPatient;

  category: AllergyCategory;

  clinicalStatus: AllergyClinicalStatus;

  substance: AllergySubstance;

  reaction: AllergyReaction;

  verification: AllergyVerification;

  metadata: AllergyMetadata;

  createdAt: string;

  updatedAt: string;

}