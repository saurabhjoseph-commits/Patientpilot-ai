/**
 * PP-003 Operations Domain
 *
 * Represents the patient's long-term
 * medical history.
 *
 * This aggregate summarizes persistent
 * health information. Individual allergies,
 * medications, diagnoses and conditions
 * are modeled separately.
 */

export type MedicalHistoryStatus =
  | "active"
  | "archived";

export interface MedicalHistoryPatient {

  patientId: string;

}

export interface MedicalHistoryLifestyle {

  smokingStatus?: string;

  alcoholUse?: string;

  substanceUse?: string;

  occupation?: string;

}

export interface MedicalHistoryFamily {

  summary?: string;

}

export interface MedicalHistoryImmunization {

  summary?: string;

}

export interface MedicalHistoryMetadata {

  notes?: string;

  externalId?: string;

}

export interface MedicalHistory {

  id: string;

  tenantId: string;

  clinicId: string;

  patient: MedicalHistoryPatient;

  status: MedicalHistoryStatus;

  lifestyle: MedicalHistoryLifestyle;

  familyHistory: MedicalHistoryFamily;

  immunizations: MedicalHistoryImmunization;

  metadata: MedicalHistoryMetadata;

  createdAt: string;

  updatedAt: string;

}