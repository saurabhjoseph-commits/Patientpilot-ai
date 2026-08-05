/**
 * PP-003 Operations Domain
 *
 * Represents a patient's overall treatment plan.
 *
 * Individual procedures, phases and clinical
 * details are modeled separately as
 * TreatmentPlanItem.
 */

export type TreatmentPlanStatus =
  | "draft"
  | "proposed"
  | "approved"
  | "active"
  | "completed"
  | "cancelled"
  | "expired";

export type TreatmentPlanPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface TreatmentPlanPatient {

  patientId: string;

}

export interface TreatmentPlanProvider {

  primaryProviderId?: string;

}

export interface TreatmentPlanSchedule {

  proposedDate?: string;

  approvedDate?: string;

  startDate?: string;

  targetCompletionDate?: string;

  completedDate?: string;

}

export interface TreatmentPlanFinancials {

  currencyCode: string;

  estimatedTotal: number;

  approvedTotal?: number;

}

export interface TreatmentPlanMetadata {

  title?: string;

  diagnosis?: string;

  notes?: string;

  externalId?: string;

}

export interface TreatmentPlan {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  patient: TreatmentPlanPatient;

  provider: TreatmentPlanProvider;

  status: TreatmentPlanStatus;

  priority: TreatmentPlanPriority;

  schedule: TreatmentPlanSchedule;

  financials: TreatmentPlanFinancials;

  metadata: TreatmentPlanMetadata;

  createdAt: string;

  updatedAt: string;

}