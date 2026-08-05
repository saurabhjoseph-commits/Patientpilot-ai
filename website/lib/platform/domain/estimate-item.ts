/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a single proposed treatment,
 * service or product within an Estimate.
 *
 * Estimate Items are planning records and may
 * later become Quote Items.
 */

export type EstimateItemType =
  | "service"
  | "treatment"
  | "product"
  | "membership"
  | "subscription"
  | "custom";

export interface EstimateItemPricing {

  currencyCode: string;

  quantity: number;

  estimatedUnitPrice: number;

  estimatedDiscount: number;

  estimatedTax: number;

  estimatedTotal: number;

}

export interface EstimateItemMetadata {

  notes?: string;

  recommended?: boolean;

  externalId?: string;

}

export interface EstimateItem {

  id: string;

  tenantId: string;

  clinicId: string;

  estimateId: string;

  productId: string;

  name: string;

  type: EstimateItemType;

  pricing: EstimateItemPricing;

  sortOrder: number;

  metadata: EstimateItemMetadata;

  createdAt: string;

  updatedAt: string;

}