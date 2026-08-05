/**
 * PP-002 Milestone C
 * Global Product Entitlement Domain
 *
 * Represents the runtime capabilities
 * granted by purchased products.
 */

export type ProductEntitlementStatus =
  | "pending"
  | "active"
  | "suspended"
  | "expired"
  | "revoked";

export type ProductEntitlementSource =
  | "product"
  | "bundle"
  | "subscription"
  | "promotion"
  | "manual";

export interface ProductEntitlementScope {

  tenantId: string;

  clinicId?: string;

  subscriptionId?: string;

}

export interface ProductEntitlementCapabilities {

  featureFlagIds: string[];

  licenseIds: string[];

  quotaIds: string[];

  usageMeterIds: string[];

  workflowTemplateIds: string[];

  integrationIds: string[];

}

export interface ProductEntitlementValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface ProductEntitlementMetadata {

  description?: string;

  grantedBy?: string;

  tags: string[];

}

export interface ProductEntitlement {

  id: string;

  productId?: string;

  productBundleId?: string;

  status: ProductEntitlementStatus;

  source: ProductEntitlementSource;

  scope: ProductEntitlementScope;

  capabilities: ProductEntitlementCapabilities;

  validity: ProductEntitlementValidity;

  metadata: ProductEntitlementMetadata;

  createdAt: string;

  updatedAt: string;

}