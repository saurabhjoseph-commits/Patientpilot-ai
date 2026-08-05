/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents a payer remittance advice
 * (ERA/EOB) received after claim
 * adjudication.
 *
 * This entity summarizes how claims
 * were processed and what amounts
 * were approved, adjusted and paid.
 *
 * Actual money received is represented
 * by the Payment aggregate.
 */

export type RemittanceAdviceStatus =
  | "received"
  | "posted"
  | "partially_posted"
  | "reconciled"
  | "cancelled";

export type RemittanceAdviceType =
  | "electronic"
  | "paper"
  | "manual"
  | "adjustment"
  | "other";

export interface RemittanceAdvicePayer {

  payerId?: string;

  payerName: string;

}

export interface RemittanceAdviceReference {

  paymentId?: string;

  insuranceClaimIds: string[];

}

export interface RemittanceAdviceFinancials {

  totalBilledAmount: number;

  totalApprovedAmount: number;

  totalPaidAmount: number;

  totalAdjustmentAmount: number;

  totalPatientResponsibility: number;

  currencyCode: string;

}

export interface RemittanceAdviceTimeline {

  receivedAt: string;

  postedAt?: string;

}

export interface RemittanceAdviceMetadata {

  notes?: string;

  externalId?: string;

}

export interface RemittanceAdvice {

  id: string;

  tenantId: string;

  clinicId: string;

  remittanceNumber: string;

  type: RemittanceAdviceType;

  status: RemittanceAdviceStatus;

  payer: RemittanceAdvicePayer;

  reference: RemittanceAdviceReference;

  financials: RemittanceAdviceFinancials;

  timeline: RemittanceAdviceTimeline;

  metadata: RemittanceAdviceMetadata;

  createdAt: string;

  updatedAt: string;

}