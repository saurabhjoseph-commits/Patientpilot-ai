/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a preliminary cost estimate.
 *
 * Estimates are planning documents used before a
 * formal Quote is issued.
 */

export type EstimateStatus =
  | "draft"
  | "shared"
  | "reviewed"
  | "approved"
  | "expired"
  | "cancelled";

export interface EstimateRevision {

  number: number;

  parentEstimateId?: string;

}

export interface EstimateValue {

  currencyCode: string;

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

}

export interface EstimateDates {

  preparedAt?: string;

  expiresAt?: string;

  approvedAt?: string;

}

export interface EstimateMetadata {

  notes?: string;

  externalId?: string;

  archived: boolean;

}

export interface Estimate {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  opportunityId?: string;

  patientId?: string;

  customerId?: string;

  estimateNumber: string;

  revision: EstimateRevision;

  status: EstimateStatus;

  value: EstimateValue;

  dates: EstimateDates;

  metadata: EstimateMetadata;

  createdAt: string;

  updatedAt: string;

}