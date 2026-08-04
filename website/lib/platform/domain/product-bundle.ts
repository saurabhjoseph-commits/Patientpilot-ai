/**
 * PP-002 Milestone C
 * Global Product Bundle Domain
 *
 * Defines reusable commercial bundles
 * composed of one or more products.
 */

export type ProductBundleStatus =
  | "draft"
  | "active"
  | "inactive"
  | "retired"
  | "archived";

export type ProductBundleType =
  | "starter"
  | "professional"
  | "enterprise"
  | "promotional"
  | "regional"
  | "custom";

export interface ProductBundleItem {

  productId: string;

  quantity: number;

  required: boolean;

}

export interface ProductBundleAvailability {

  countries?: string[];

  availableFrom: string;

  availableUntil?: string;

}

export interface ProductBundleMetadata {

  description?: string;

  version: string;

  createdBy?: string;

  tags: string[];

}

export interface ProductBundle {

  id: string;

  code: string;

  name: string;

  status: ProductBundleStatus;

  type: ProductBundleType;

  items: ProductBundleItem[];

  availability: ProductBundleAvailability;

  metadata: ProductBundleMetadata;

  createdAt: string;

  updatedAt: string;

}