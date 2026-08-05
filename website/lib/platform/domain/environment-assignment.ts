/**
 * PP-002 Milestone C
 * Global Environment Assignment Domain
 *
 * Assigns reusable execution
 * environments to platform
 * resources.
 */

export type EnvironmentAssignmentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired";

export type EnvironmentAssignmentTarget =
  | "organization"
  | "tenant"
  | "application"
  | "deployment"
  | "workflow"
  | "integration"
  | "api_key"
  | "webhook"
  | "job"
  | "service";

export interface EnvironmentAssignmentScope {

  tenantId?: string;

}

export interface EnvironmentAssignmentPriority {

  priority: number;

  isPrimary: boolean;

}

export interface EnvironmentAssignmentValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface EnvironmentAssignmentMetadata {

  assignedBy?: string;

  notes?: string;

  tags: string[];

}

export interface EnvironmentAssignment {

  id: string;

  environmentId: string;

  target: EnvironmentAssignmentTarget;

  targetId: string;

  status: EnvironmentAssignmentStatus;

  scope: EnvironmentAssignmentScope;

  priority: EnvironmentAssignmentPriority;

  validity: EnvironmentAssignmentValidity;

  metadata: EnvironmentAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}