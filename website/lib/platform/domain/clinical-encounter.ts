/**
 * PP-003 Operations Domain
 *
 * Represents an actual clinical encounter
 * between a patient and one or more providers.
 *
 * This aggregate records the visit itself.
 * Clinical notes, diagnoses, procedures,
 * prescriptions and observations are modeled
 * separately.
 */

export type ClinicalEncounterStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ClinicalEncounterType =
  | "consultation"
  | "examination"
  | "emergency"
  | "treatment"
  | "follow_up"
  | "hygiene"
  | "virtual"
  | "other";

export type ClinicalEncounterOutcome =
  | "completed"
  | "partially_completed"
  | "referred"
  | "follow_up_required"
  | "cancelled";

export interface ClinicalEncounterPatient {

  patientId: string;

}

export interface ClinicalEncounterProvider {

  primaryProviderId?: string;

}

export interface ClinicalEncounterSchedule {

  startedAt?: string;

  endedAt?: string;

}

export interface ClinicalEncounterReferences {

  appointmentId?: string;

  treatmentPlanId?: string;

}

export interface ClinicalEncounterSummary {

  chiefComplaint?: string;

  outcome: ClinicalEncounterOutcome;

}

export interface ClinicalEncounterMetadata {

  notes?: string;

  externalId?: string;

}

export interface ClinicalEncounter {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  patient: ClinicalEncounterPatient;

  provider: ClinicalEncounterProvider;

  references: ClinicalEncounterReferences;

  status: ClinicalEncounterStatus;

  type: ClinicalEncounterType;

  schedule: ClinicalEncounterSchedule;

  summary: ClinicalEncounterSummary;

  metadata: ClinicalEncounterMetadata;

  createdAt: string;

  updatedAt: string;

}