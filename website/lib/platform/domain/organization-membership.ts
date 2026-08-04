/**
 * PP-002 Milestone C
 * Global Organization Membership Domain
 *
 * Associates organizations with
 * business entities that belong
 * to the organization.
 */

export type OrganizationMembershipStatus =
  | "pending"
  | "active"
  | "inactive"
  | "suspended"
  | "expired";

export type OrganizationMembershipTarget =
  | "tenant"
  | "clinic_group"
  | "clinic"
  | "location"
  | "partner"
  | "team"
  | "user";

export type OrganizationMembershipRole =
  | "owner"
  | "administrator"
  | "member"
  | "affiliate"
  | "partner"
  | "observer";

export interface OrganizationMembershipScope {

  tenantId?: string;

}

export interface OrganizationMembershipValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface OrganizationMembershipMetadata {

  invitedBy?: string;

  notes?: string;

  tags: string[];

}

export interface OrganizationMembership {

  id: string;

  organizationId: string;

  target: OrganizationMembershipTarget;

  targetId: string;

  role: OrganizationMembershipRole;

  status: OrganizationMembershipStatus;

  scope: OrganizationMembershipScope;

  validity: OrganizationMembershipValidity;

  metadata: OrganizationMembershipMetadata;

  createdAt: string;

  updatedAt: string;

}