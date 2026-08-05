/**
 * PP-002 Milestone C
 * Global Product Domain
 *
 * Defines the canonical catalog
 * of commercial products.
 */

export type ProductStatus =
  | "draft"
  | "active"
  | "inactive"
  | "retired"
  | "archived";

export type ProductType =
  | "subscription"
  | "add_on"
  | "feature"
  | "bundle"
  | "integration"
  | "service"
  | "marketplace";

export interface ProductClassification {

  category: string;

  subcategory?: string;

  sku: string;

}

export interface ProductCapabilities {

  featureFlagIds: string[];

  usageMeterIds: string[];

  licenseIds: string[];

}

export interface ProductAvailability {

  countries?: string[];

  availableFrom: string;

  availableUntil?: string;

}

export interface ProductMetadata {

  description?: string;

  version: string;

  createdBy?: string;

  tags: string[];

}

export interface Product {

  id: string;

  name: string;

  code: string;

  status: ProductStatus;

  type: ProductType;

  classification: ProductClassification;

  capabilities: ProductCapabilities;

  availability: ProductAvailability;

  metadata: ProductMetadata;

  createdAt: string;

  updatedAt: string;

}