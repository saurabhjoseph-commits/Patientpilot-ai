/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents a single billable line item
 * within an invoice.
 *
 * Invoice totals are maintained by the
 * Invoice aggregate.
 */

export type InvoiceItemType =
  | "procedure"
  | "product"
  | "service"
  | "adjustment"
  | "discount"
  | "tax"
  | "other";

export interface InvoiceItemReference {

  treatmentPlanItemId?: string;

  appointmentId?: string;

  encounterId?: string;

  procedureCode?: string;

}

export interface InvoiceItemDescription {

  code?: string;

  name: string;

  description?: string;

}

export interface InvoiceItemPricing {

  quantity: number;

  unitPrice: number;

  discount: number;

  tax: number;

  lineTotal: number;

  currencyCode: string;

}

export interface InvoiceItemMetadata {

  notes?: string;

  externalId?: string;

}

export interface InvoiceItem {

  id: string;

  tenantId: string;

  clinicId: string;

  invoiceId: string;

  type: InvoiceItemType;

  reference: InvoiceItemReference;

  description: InvoiceItemDescription;

  pricing: InvoiceItemPricing;

  metadata: InvoiceItemMetadata;

  createdAt: string;

  updatedAt: string;

}