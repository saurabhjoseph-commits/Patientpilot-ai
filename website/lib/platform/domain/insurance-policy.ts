/**
 * PP-003 Operations Domain
 *
 * Represents a specific insurance policy
 * associated with a patient's insurance
 * account.
 *
 * One Insurance account may contain
 * multiple policies over time.
 */

export type InsurancePolicyStatus =
  | "active"
  | "pending"
  | "expired"
  | "terminated"
  | "cancelled";

export type InsurancePlanType =
  | "ppo"
  | "hmo"
  | "epo"
  | "indemnity"
  | "government"
  | "discount"
  | "other";

export interface InsurancePolicySubscriber {

  subscriberId?: string;

  memberId: string;

  firstName?: string;

  lastName?: string;

  relationshipToPatient:
    | "self"
    | "spouse"
    | "parent"
    | "guardian"
    | "child"
    | "other";

}

export interface InsurancePolicyPlan {

  planName?: string;

  groupNumber?: string;

  policyNumber: string;

  type: InsurancePlanType;

}

export interface InsurancePolicyCoverage {

  effectiveDate?: string;

  expirationDate?: string;

}

export interface InsurancePolicyBenefits {

  deductible?: number;

  deductibleRemaining?: number;

  annualMaximum?: number;

  annualMaximumRemaining?: number;

  currencyCode: string;

}

export interface InsurancePolicyMetadata {

  notes?: string;

  externalId?: string;

}

export interface InsurancePolicy {

  id: string;

  tenantId: string;

  clinicId: string;

  insuranceId: string;

  status: InsurancePolicyStatus;

  subscriber: InsurancePolicySubscriber;

  plan: InsurancePolicyPlan;

  coverage: InsurancePolicyCoverage;

  benefits: InsurancePolicyBenefits;

  metadata: InsurancePolicyMetadata;

  createdAt: string;

  updatedAt: string;

}