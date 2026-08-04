/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a single product, service or treatment
 * within a Deal.
 */

export type DealProductType =
  | "service"
  | "treatment"
  | "product"
  | "membership"
  | "subscription"
  | "custom";

export type DealProductStatus =
  | "planned"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface DealProductPricing {

  currencyCode: string;

  quantity: number;

  unitPrice: number;

  discount: number;

  tax: number;

  total: number;

}

export interface DealProductFulfillment {

  appointmentId?: string;

  providerId?: string;

  completedAt?: string;

}

export interface DealProductMetadata {

  notes?: string;

  externalId?: string;

}

export interface DealProduct {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  dealId: string;

  productId: string;

  name: string;

  type: DealProductType;

  status: DealProductStatus;

  pricing: DealProductPricing;

  fulfillment: DealProductFulfillment;

  metadata: DealProductMetadata;

  createdAt: string;

  updatedAt: string;

}