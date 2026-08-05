// website/lib/platform/domain/workflow-transition.ts

/**
 * PatientPilot AI
 * Workflow Transition
 *
 * Defines how execution moves from one workflow
 * step to the next.
 */

export type WorkflowTransitionType =
  | "success"
  | "failure"
  | "condition"
  | "timeout"
  | "manual"
  | "default";

export interface WorkflowTransitionCondition {
  field: string;

  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "exists";

  value?: unknown;
}

export interface WorkflowTransition {
  id: string;

  workflowDefinitionId: string;

  fromStepId: string;

  toStepId: string;

  type: WorkflowTransitionType;

  priority: number;

  conditions: WorkflowTransitionCondition[];

  enabled: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export function isDefaultTransition(
  transition: WorkflowTransition,
): boolean {
  return transition.type === "default";
}

export function hasConditions(
  transition: WorkflowTransition,
): boolean {
  return transition.conditions.length > 0;
}

export function sortTransitions(
  transitions: WorkflowTransition[],
): WorkflowTransition[] {
  return [...transitions].sort(
    (a, b) => a.priority - b.priority,
  );
}