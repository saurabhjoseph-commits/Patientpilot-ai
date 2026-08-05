/**
 * PP-002 Milestone C
 * Global Catalog Domain
 *
 * Defines commercial catalogs that expose
 * products to specific markets and channels.
 */

export type CatalogStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type CatalogType =
  | "global"
  | "regional"
  | "country"
  | "partner"
  | "tenant"
  | "marketplace";

export interface CatalogScope {

  tenantId?: string;

  countryCodes: string[];

  currencies: string[];

  languages: string[];

}

export interface CatalogContent {

  productIds: string[];

  productBundleIds: string[];

  productVersionIds: string[];

  priceBookIds: string[];

}

export interface CatalogAvailability {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface CatalogMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Catalog {

  id: string;

  code: string;

  name: string;

  status: CatalogStatus;

  type: CatalogType;

  scope: CatalogScope;

  content: CatalogContent;

  availability: CatalogAvailability;

  metadata: CatalogMetadata;

  createdAt: string;

  updatedAt: string;

}