/**
 * PP-002 Milestone C
 * Global Brand Assignment Domain
 *
 * Assigns a reusable brand
 * to business entities across
 * the platform.
 */

export type BrandAssignmentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired";

export type BrandAssignmentTarget =
  | "organization"
  | "tenant"
  | "clinic_group"
  | "clinic"
  | "location"
  | "website"
  | "mobile_app"
  | "patient_portal";

export interface BrandAssignmentScope {

  tenantId?: string;

}

export interface BrandAssignmentPriority {

  priority: number;

  isPrimary: boolean;

}

export interface BrandAssignmentValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface BrandAssignmentMetadata {

  assignedBy?: string;

  notes?: string;

  tags: string[];

}

export interface BrandAssignment {

  id: string;

  brandId: string;

  target: BrandAssignmentTarget;

  targetId: string;

  status: BrandAssignmentStatus;

  scope: BrandAssignmentScope;

  priority: BrandAssignmentPriority;

  validity: BrandAssignmentValidity;

  metadata: BrandAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}