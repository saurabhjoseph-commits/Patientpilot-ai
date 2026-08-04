/**
 * PP-002 Milestone A
 * Global Treatment Domain
 *
 * Represents a clinical treatment that has been
 * planned or performed for a patient.
 */

export type TreatmentStatus =
  | "planned"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface TreatmentOutcome {
  successful?: boolean;
  notes?: string;
  followUpRequired: boolean;
}

export interface TreatmentFinancial {
  estimatedCost?: number;
  actualCost?: number;
  currency: string;
  insuranceClaimed: boolean;
}

export interface TreatmentMetadata {
  externalId?: string;
  diagnosisCode?: string;
  procedureCode?: string;
}

export interface Treatment {

  id: string;

  tenantId: string;

  clinicId: string;

  patientId: string;

  appointmentId?: string;

  providerId: string;

  serviceId: string;

  status: TreatmentStatus;

  treatmentDate?: string;

  toothNumbers?: string[];

  description?: string;

  outcome: TreatmentOutcome;

  financial: TreatmentFinancial;

  metadata: TreatmentMetadata;

  createdAt: string;

  updatedAt: string;

}