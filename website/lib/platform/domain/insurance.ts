/**
 * PP-003 Operations Domain
 *
 * Represents a patient's insurance account.
 *
 * Policies are modeled separately because
 * coverage may change over time while the
 * insurer relationship remains.
 */

export type InsuranceStatus =
  | "active"
  | "inactive"
  | "pending"
  | "expired";

export type CoveragePriority =
  | "primary"
  | "secondary"
  | "tertiary";

export interface InsurancePatient {

  patientId: string;

}

export interface InsurancePayer {

  payerId?: string;

  payerName: string;

}

export interface InsuranceCoverage {

  priority: CoveragePriority;

  effectiveDate?: string;

  terminationDate?: string;

}

export interface InsuranceVerification {

  verifiedAt?: string;

  verifiedBy?: string;

  eligibilityVerified: boolean;

}

export interface InsuranceMetadata {

  notes?: string;

  externalId?: string;

}

export interface Insurance {

  id: string;

  tenantId: string;

  clinicId: string;

  patient: InsurancePatient;

  payer: InsurancePayer;

  status: InsuranceStatus;

  coverage: InsuranceCoverage;

  verification: InsuranceVerification;

  metadata: InsuranceMetadata;

  createdAt: string;

  updatedAt: string;

}