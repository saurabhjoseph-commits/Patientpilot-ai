/**
 * PP-002 Milestone C
 * Global Sales Channel Assignment Domain
 *
 * Assigns reusable sales channels
 * to markets, tenants and organizations.
 */

export type SalesChannelAssignmentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired";

export type SalesChannelAssignmentTarget =
  | "global"
  | "country"
  | "region"
  | "partner"
  | "tenant"
  | "clinic_group"
  | "clinic";

export interface SalesChannelAssignmentScope {

  tenantId?: string;

  countryCode?: string;

  regionCode?: string;

  partnerId?: string;

  clinicGroupId?: string;

  clinicId?: string;

}

export interface SalesChannelAssignmentPriority {

  priority: number;

  exclusive: boolean;

}

export interface SalesChannelAssignmentValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface SalesChannelAssignmentMetadata {

  description?: string;

  assignedBy?: string;

  tags: string[];

}

export interface SalesChannelAssignment {

  id: string;

  salesChannelId: string;

  status: SalesChannelAssignmentStatus;

  target: SalesChannelAssignmentTarget;

  scope: SalesChannelAssignmentScope;

  priority: SalesChannelAssignmentPriority;

  validity: SalesChannelAssignmentValidity;

  metadata: SalesChannelAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}