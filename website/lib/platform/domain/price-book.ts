/**
 * PP-002 Milestone C
 * Global Price Book Domain
 *
 * Represents a reusable pricing catalog
 * for products and services.
 */

export type PriceBookStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type PriceBookScope =
  | "global"
  | "country"
  | "tenant"
  | "clinic";

export interface PriceBookCurrency {

  code: string;

}

export interface PriceBookValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface PriceBookItem {

  id: string;

  sku: string;

  name: string;

  category: string;

  unitPrice: number;

  billingModel:
    | "one_time"
    | "monthly"
    | "yearly"
    | "usage_based";

  minimumQuantity?: number;

  maximumQuantity?: number;

  metadata?: Record<string, string>;

}

export interface PriceBookMetadata {

  description?: string;

  version: string;

  createdBy?: string;

  tags: string[];

}

export interface PriceBook {

  id: string;

  tenantId?: string;

  clinicId?: string;

  name: string;

  status: PriceBookStatus;

  scope: PriceBookScope;

  country?: string;

  currency: PriceBookCurrency;

  items: PriceBookItem[];

  validity: PriceBookValidity;

  metadata: PriceBookMetadata;

  createdAt: string;

  updatedAt: string;

}