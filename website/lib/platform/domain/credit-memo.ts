/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents a financial credit that can
 * be applied against future invoices.
 *
 * Credit memos do not return money.
 * Refunds are handled by the Refund
 * aggregate.
 */

export type CreditMemoStatus =
  | "draft"
  | "issued"
  | "partially_applied"
  | "fully_applied"
  | "expired"
  | "cancelled";

export type CreditMemoReason =
  | "overpayment"
  | "billing_adjustment"
  | "insurance_adjustment"
  | "service_credit"
  | "pricing_correction"
  | "goodwill"
  | "other";

export interface CreditMemoCustomer {

  customerId: string;

  patientId?: string;

}

export interface CreditMemoReference {

  invoiceId?: string;

  paymentId?: string;

  refundId?: string;

}

export interface CreditMemoAmount {

  originalAmount: number;

  availableAmount: number;

  currencyCode: string;

}

export interface CreditMemoValidity {

  issuedAt: string;

  expiresAt?: string;

}

export interface CreditMemoMetadata {

  notes?: string;

  externalId?: string;

}

export interface CreditMemo {

  id: string;

  tenantId: string;

  clinicId: string;

  creditMemoNumber: string;

  status: CreditMemoStatus;

  reason: CreditMemoReason;

  customer: CreditMemoCustomer;

  reference: CreditMemoReference;

  amount: CreditMemoAmount;

  validity: CreditMemoValidity;

  metadata: CreditMemoMetadata;

  createdAt: string;

  updatedAt: string;

}