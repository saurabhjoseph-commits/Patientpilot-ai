/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents a financial invoice issued
 * for billable services or products.
 *
 * Invoice items are modeled separately.
 * Payments are handled by the Payment
 * aggregate.
 */

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "void"
  | "cancelled";

export type InvoiceType =
  | "patient"
  | "insurance"
  | "mixed"
  | "adjustment"
  | "credit";

export interface InvoiceCustomer {

  customerId: string;

  patientId?: string;

}

export interface InvoiceReferences {

  appointmentId?: string;

  encounterId?: string;

  treatmentPlanId?: string;

  estimateId?: string;

}

export interface InvoiceAmounts {

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

  balanceDue: number;

  currencyCode: string;

}

export interface InvoiceDates {

  issuedAt?: string;

  dueAt?: string;

}

export interface InvoiceMetadata {

  notes?: string;

  externalId?: string;

}

export interface Invoice {

  id: string;

  tenantId: string;

  clinicId: string;

  invoiceNumber: string;

  type: InvoiceType;

  status: InvoiceStatus;

  customer: InvoiceCustomer;

  references: InvoiceReferences;

  amounts: InvoiceAmounts;

  dates: InvoiceDates;

  metadata: InvoiceMetadata;

  createdAt: string;

  updatedAt: string;

}