/**
 * PP-002 Milestone C
 * Global Catalog Assignment Domain
 *
 * Assigns commercial catalogs
 * to markets, tenants and channels.
 */

export type CatalogAssignmentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired";

export type CatalogAssignmentTarget =
  | "global"
  | "country"
  | "region"
  | "partner"
  | "tenant"
  | "clinic_group"
  | "clinic"
  | "sales_channel";

export interface CatalogAssignmentScope {

  tenantId?: string;

  countryCode?: string;

  regionCode?: string;

  partnerId?: string;

  clinicGroupId?: string;

  clinicId?: string;

  salesChannel?: string;

}

export interface CatalogAssignmentPriority {

  priority: number;

  exclusive: boolean;

}

export interface CatalogAssignmentValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface CatalogAssignmentMetadata {

  description?: string;

  assignedBy?: string;

  tags: string[];

}

export interface CatalogAssignment {

  id: string;

  catalogId: string;

  status: CatalogAssignmentStatus;

  target: CatalogAssignmentTarget;

  scope: CatalogAssignmentScope;

  priority: CatalogAssignmentPriority;

  validity: CatalogAssignmentValidity;

  metadata: CatalogAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}