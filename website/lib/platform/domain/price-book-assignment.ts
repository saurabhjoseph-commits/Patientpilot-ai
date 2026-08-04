/**
 * PP-002 Milestone C
 * Global Price Book Assignment Domain
 *
 * Assigns a PriceBook to one or more
 * business scopes.
 */

export type PriceBookAssignmentStatus =
  | "active"
  | "inactive"
  | "expired"
  | "archived";

export type PriceBookAssignmentScope =
  | "global"
  | "country"
  | "tenant"
  | "clinic"
  | "subscription"
  | "customer_segment";

export interface PriceBookAssignmentTarget {

  country?: string;

  tenantId?: string;

  clinicId?: string;

  subscriptionId?: string;

  customerSegment?: string;

}

export interface PriceBookAssignmentValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface PriceBookAssignmentPriority {

  priority: number;

  isDefault: boolean;

}

export interface PriceBookAssignmentMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface PriceBookAssignment {

  id: string;

  priceBookId: string;

  status: PriceBookAssignmentStatus;

  scope: PriceBookAssignmentScope;

  target: PriceBookAssignmentTarget;

  priority: PriceBookAssignmentPriority;

  validity: PriceBookAssignmentValidity;

  metadata: PriceBookAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}