/**
 * PP-002 Milestone C
 * Global Territory Assignment Domain
 *
 * Assigns reusable territories
 * to business entities across
 * the platform.
 */

export type TerritoryAssignmentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired";

export type TerritoryAssignmentTarget =
  | "tenant"
  | "partner"
  | "partner_agreement"
  | "sales_channel"
  | "clinic_group"
  | "clinic"
  | "location"
  | "provider"
  | "team"
  | "user";

export interface TerritoryAssignmentScope {

  tenantId?: string;

}

export interface TerritoryAssignmentPriority {

  priority: number;

  exclusive: boolean;

}

export interface TerritoryAssignmentValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface TerritoryAssignmentMetadata {

  description?: string;

  assignedBy?: string;

  tags: string[];

}

export interface TerritoryAssignment {

  id: string;

  territoryId: string;

  target: TerritoryAssignmentTarget;

  targetId: string;

  status: TerritoryAssignmentStatus;

  scope: TerritoryAssignmentScope;

  priority: TerritoryAssignmentPriority;

  validity: TerritoryAssignmentValidity;

  metadata: TerritoryAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}