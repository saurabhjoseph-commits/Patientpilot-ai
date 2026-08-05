/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents money returned to a payer.
 *
 * Refunds are independent financial
 * transactions linked to an original
 * payment.
 */

export type RefundStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type RefundReason =
  | "patient_request"
  | "duplicate_payment"
  | "overpayment"
  | "billing_error"
  | "insurance_adjustment"
  | "service_not_rendered"
  | "other";

export interface RefundReference {

  paymentId: string;

  paymentMethodId: string;

  invoiceId?: string;

}

export interface RefundAmount {

  amount: number;

  currencyCode: string;

}

export interface RefundTransaction {

  transactionId?: string;

  gatewayReference?: string;

  authorizationCode?: string;

}

export interface RefundProcessing {

  processedAt?: string;

  processedBy?: string;

}

export interface RefundMetadata {

  notes?: string;

  externalId?: string;

}

export interface Refund {

  id: string;

  tenantId: string;

  clinicId: string;

  refundNumber: string;

  status: RefundStatus;

  reason: RefundReason;

  reference: RefundReference;

  amount: RefundAmount;

  transaction: RefundTransaction;

  processing: RefundProcessing;

  metadata: RefundMetadata;

  createdAt: string;

  updatedAt: string;

}