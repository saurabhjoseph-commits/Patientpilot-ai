/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a formal commercial quotation
 * presented to a customer.
 *
 * A Quote may contain multiple Quote Items and
 * can later be accepted, rejected, expired or
 * converted into a Deal.
 */

export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";

export interface QuoteRevision {

  number: number;

  parentQuoteId?: string;

}

export interface QuoteValue {

  currencyCode: string;

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

}

export interface QuoteDates {

  issuedAt?: string;

  expiresAt?: string;

  acceptedAt?: string;

  rejectedAt?: string;

}

export interface QuoteApproval {

  approvedByUserId?: string;

  approvedAt?: string;

}

export interface QuoteMetadata {

  notes?: string;

  externalId?: string;

  archived: boolean;

}

export interface Quote {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  dealId: string;

  patientId?: string;

  customerId?: string;

  quoteNumber: string;

  revision: QuoteRevision;

  status: QuoteStatus;

  value: QuoteValue;

  approval: QuoteApproval;

  dates: QuoteDates;

  metadata: QuoteMetadata;

  createdAt: string;

  updatedAt: string;

}