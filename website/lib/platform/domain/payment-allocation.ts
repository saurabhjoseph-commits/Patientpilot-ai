/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents the allocation of a payment
 * to an invoice.
 *
 * A payment may be allocated across
 * multiple invoices.
 *
 * An invoice may receive multiple
 * payments.
 */

export type PaymentAllocationStatus =
  | "pending"
  | "allocated"
  | "reversed"
  | "cancelled";

export interface PaymentAllocationReference {

  paymentId: string;

  invoiceId: string;

}

export interface PaymentAllocationAmount {

  amount: number;

  currencyCode: string;

}

export interface PaymentAllocationAudit {

  allocatedAt: string;

  allocatedBy?: string;

}

export interface PaymentAllocationMetadata {

  notes?: string;

  externalId?: string;

}

export interface PaymentAllocation {

  id: string;

  tenantId: string;

  clinicId: string;

  reference: PaymentAllocationReference;

  amount: PaymentAllocationAmount;

  status: PaymentAllocationStatus;

  audit: PaymentAllocationAudit;

  metadata: PaymentAllocationMetadata;

  createdAt: string;

  updatedAt: string;

}