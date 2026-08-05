/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a single proposed product, service or
 * treatment within a Quote.
 *
 * Quote Items become Deal Products when the
 * Quote is accepted.
 */

export type QuoteItemType =
  | "service"
  | "treatment"
  | "product"
  | "membership"
  | "subscription"
  | "custom";

export interface QuoteItemPricing {

  currencyCode: string;

  quantity: number;

  unitPrice: number;

  discount: number;

  tax: number;

  total: number;

}

export interface QuoteItemMetadata {

  notes?: string;

  externalId?: string;

}

export interface QuoteItem {

  id: string;

  tenantId: string;

  clinicId: string;

  quoteId: string;

  productId: string;

  name: string;

  type: QuoteItemType;

  pricing: QuoteItemPricing;

  sortOrder: number;

  metadata: QuoteItemMetadata;

  createdAt: string;

  updatedAt: string;

}