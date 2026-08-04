/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents a single billable procedure
 * or service within an insurance claim.
 *
 * Each line may be adjudicated
 * independently by the payer.
 */

export type InsuranceClaimLineStatus =
  | "pending"
  | "submitted"
  | "approved"
  | "partially_approved"
  | "denied"
  | "paid"
  | "appealed"
  | "cancelled";

export interface InsuranceClaimLineReference {

  claimId: string;

  invoiceItemId?: string;

  treatmentPlanItemId?: string;

  encounterId?: string;

}

export interface InsuranceClaimProcedure {

  procedureCode: string;

  description: string;

  toothNumber?: string;

  toothSurface?: string;

  serviceDate: string;

}

export interface InsuranceClaimLineFinancials {

  billedAmount: number;

  approvedAmount?: number;

  paidAmount?: number;

  adjustmentAmount?: number;

  patientResponsibility?: number;

  currencyCode: string;

}

export interface InsuranceClaimAdjudication {

  denialCode?: string;

  denialReason?: string;

  adjudicatedAt?: string;

}

export interface InsuranceClaimLineMetadata {

  notes?: string;

  externalId?: string;

}

export interface InsuranceClaimLine {

  id: string;

  tenantId: string;

  clinicId: string;

  lineNumber: number;

  status: InsuranceClaimLineStatus;

  reference: InsuranceClaimLineReference;

  procedure: InsuranceClaimProcedure;

  financials: InsuranceClaimLineFinancials;

  adjudication: InsuranceClaimAdjudication;

  metadata: InsuranceClaimLineMetadata;

  createdAt: string;

  updatedAt: string;

}