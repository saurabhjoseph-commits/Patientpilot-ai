/**
 * PP-003 Operations Domain
 *
 * Represents an individual planned treatment
 * within a Treatment Plan.
 *
 * Each item represents a single clinical
 * procedure or service.
 */

export type TreatmentPlanItemStatus =
  | "planned"
  | "approved"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "deferred";

export type TreatmentPlanItemPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface TreatmentProcedure {

  code: string;

  name: string;

}

export interface TreatmentTarget {

  toothNumber?: string;

  toothSurface?: string;

  area?: string;

}

export interface TreatmentAssignment {

  providerId?: string;

  appointmentId?: string;

}

export interface TreatmentSequence {

  phase?: number;

  order: number;

}

export interface TreatmentEstimate {

  durationMinutes?: number;

  estimatedCost: number;

  insuranceEstimate?: number;

  patientEstimate?: number;

  currencyCode: string;

}

export interface TreatmentExecution {

  scheduledDate?: string;

  completedDate?: string;

}

export interface TreatmentPlanItemMetadata {

  diagnosis?: string;

  notes?: string;

  externalId?: string;

}

export interface TreatmentPlanItem {

  id: string;

  tenantId: string;

  clinicId: string;

  treatmentPlanId: string;

  status: TreatmentPlanItemStatus;

  priority: TreatmentPlanItemPriority;

  procedure: TreatmentProcedure;

  target: TreatmentTarget;

  assignment: TreatmentAssignment;

  sequence: TreatmentSequence;

  estimate: TreatmentEstimate;

  execution: TreatmentExecution;

  metadata: TreatmentPlanItemMetadata;

  createdAt: string;

  updatedAt: string;

}