// website/lib/platform/domain/workflow-definition.ts

import type {
  WorkflowStatus,
} from "./workflow";

/**
 * PatientPilot AI
 * Workflow Definition
 *
 * Immutable blueprint describing how a workflow
 * executes. Runtime executions should reference
 * a published workflow definition rather than
 * embedding business logic.
 */

export type WorkflowDefinitionStatus =
  | "draft"
  | "published"
  | "archived";

export interface WorkflowDefinitionMetadata {
  description?: string;

  category?: string;

  tags?: string[];

  author?: string;
}

export interface WorkflowStepReference {
  id: string;

  code: string;

  name: string;

  order: number;

  required?: boolean;
}

export interface WorkflowDefinition {
  id: string;

  workflowId: string;

  version: number;

  name: string;

  status: WorkflowDefinitionStatus;

  initialWorkflowStatus: WorkflowStatus;

  entryStepId: string;

  steps: WorkflowStepReference[];

  metadata: WorkflowDefinitionMetadata;

  publishedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export function isWorkflowDefinitionPublished(
  definition: WorkflowDefinition,
): boolean {
  return (
    definition.status ===
    "published"
  );
}

export function getWorkflowStep(
  definition: WorkflowDefinition,
  stepId: string,
): WorkflowStepReference | undefined {
  return definition.steps.find(
    (step) => step.id === stepId,
  );
}

export function getOrderedWorkflowSteps(
  definition: WorkflowDefinition,
): WorkflowStepReference[] {
  return [...definition.steps].sort(
    (a, b) => a.order - b.order,
  );
}