/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Assigns an immutable AI Policy Version
 * to a runtime scope.
 */

export type AIPolicyAssignmentStatus =
  | "active"
  | "inactive"
  | "scheduled"
  | "expired";

export type AIPolicyAssignmentScope =
  | "global"
  | "tenant"
  | "organization"
  | "clinic"
  | "location"
  | "environment"
  | "application"
  | "workflow"
  | "agent";

export interface AIPolicyAssignmentTarget {

  tenantId?: string;

  organizationId?: string;

  clinicId?: string;

  locationId?: string;

  environmentId?: string;

  applicationId?: string;

  workflowId?: string;

  agentId?: string;

}

export interface AIPolicyAssignmentSchedule {

  effectiveFrom: string;

  effectiveUntil?: string;

}

export interface AIPolicyAssignmentPriority {

  priority: number;

  stopEvaluation: boolean;

}

export interface AIPolicyAssignmentMetadata {

  description?: string;

  assignedByUserId?: string;

  tags: string[];

}

export interface AIPolicyAssignment {

  id: string;

  policyVersionId: string;

  status: AIPolicyAssignmentStatus;

  scope: AIPolicyAssignmentScope;

  target: AIPolicyAssignmentTarget;

  schedule: AIPolicyAssignmentSchedule;

  priority: AIPolicyAssignmentPriority;

  metadata: AIPolicyAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}