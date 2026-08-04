/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents a payment received by
 * the clinic.
 *
 * Allocation to invoices is handled
 * separately through PaymentAllocation.
 */

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export type PaymentType =
  | "patient"
  | "insurance"
  | "adjustment"
  | "refund"
  | "other";

export interface PaymentPayer {

  customerId?: string;

  patientId?: string;

  insuranceId?: string;

  payerName?: string;

}

export interface PaymentAmount {

  amount: number;

  currencyCode: string;

}

export interface PaymentTransaction {

  transactionId?: string;

  authorizationCode?: string;

  gatewayReference?: string;

}

export interface PaymentReceipt {

  receivedAt: string;

  receivedBy?: string;

}

export interface PaymentMetadata {

  notes?: string;

  externalId?: string;

}

export interface Payment {

  id: string;

  tenantId: string;

  clinicId: string;

  paymentNumber: string;

  type: PaymentType;

  status: PaymentStatus;

  payer: PaymentPayer;

  amount: PaymentAmount;

  methodId: string;

  transaction: PaymentTransaction;

  receipt: PaymentReceipt;

  metadata: PaymentMetadata;

  createdAt: string;

  updatedAt: string;

}