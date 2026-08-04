/**
 * PP-003 Operations Domain
 *
 * Represents a patient's medication.
 *
 * Medications are maintained independently
 * from encounters because they represent
 * long-term clinical information.
 */

export type MedicationClinicalStatus =
  | "active"
  | "completed"
  | "discontinued"
  | "on_hold"
  | "entered_in_error";

export type MedicationCategory =
  | "prescription"
  | "over_the_counter"
  | "supplement"
  | "vaccine"
  | "other";

export interface MedicationPatient {

  patientId: string;

}

export interface MedicationIdentity {

  code?: string;

  name: string;

  category: MedicationCategory;

}

export interface MedicationPrescription {

  prescribingProviderId?: string;

  indication?: string;

}

export interface MedicationDosage {

  strength?: string;

  dose?: string;

  route?: string;

  frequency?: string;

}

export interface MedicationSchedule {

  startedAt?: string;

  endedAt?: string;

}

export interface MedicationMetadata {

  notes?: string;

  externalId?: string;

}

export interface Medication {

  id: string;

  tenantId: string;

  clinicId: string;

  patient: MedicationPatient;

  identity: MedicationIdentity;

  prescription: MedicationPrescription;

  dosage: MedicationDosage;

  schedule: MedicationSchedule;

  clinicalStatus: MedicationClinicalStatus;

  metadata: MedicationMetadata;

  createdAt: string;

  updatedAt: string;

}