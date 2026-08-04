/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents an insurance claim submitted
 * to a payer.
 *
 * Individual billed services are modeled
 * separately as InsuranceClaimLine.
 */

export type InsuranceClaimStatus =
  | "draft"
  | "ready_for_submission"
  | "submitted"
  | "received"
  | "under_review"
  | "adjudicated"
  | "partially_paid"
  | "paid"
  | "denied"
  | "closed"
  | "cancelled";

export type InsuranceClaimType =
  | "professional"
  | "institutional"
  | "dental"
  | "medical"
  | "predetermination"
  | "secondary"
  | "corrected"
  | "other";

export interface InsuranceClaimPatient {

  patientId: string;

  customerId?: string;

}

export interface InsuranceClaimCoverage {

  insuranceId: string;

  insurancePolicyId: string;

  payerId?: string;

}

export interface InsuranceClaimReferences {

  encounterId?: string;

  appointmentId?: string;

  treatmentPlanId?: string;

  invoiceId?: string;

}

export interface InsuranceClaimFinancials {

  billedAmount: number;

  approvedAmount?: number;

  paidAmount?: number;

  patientResponsibility?: number;

  currencyCode: string;

}

export interface InsuranceClaimTimeline {

  serviceDate: string;

  submittedAt?: string;

  adjudicatedAt?: string;

  paidAt?: string;

}

export interface InsuranceClaimMetadata {

  notes?: string;

  externalId?: string;

}

export interface InsuranceClaim {

  id: string;

  tenantId: string;

  clinicId: string;

  claimNumber: string;

  type: InsuranceClaimType;

  status: InsuranceClaimStatus;

  patient: InsuranceClaimPatient;

  coverage: InsuranceClaimCoverage;

  references: InsuranceClaimReferences;

  financials: InsuranceClaimFinancials;

  timeline: InsuranceClaimTimeline;

  metadata: InsuranceClaimMetadata;

  createdAt: string;

  updatedAt: string;

}