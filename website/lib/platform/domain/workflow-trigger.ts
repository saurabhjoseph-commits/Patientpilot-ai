// website/lib/platform/domain/workflow-trigger.ts

/**
 * PatientPilot AI
 * Workflow Trigger
 *
 * Defines the event that starts a workflow.
 */

export type WorkflowTriggerType =
  | "manual"
  | "event"
  | "schedule"
  | "webhook"
  | "api";

export interface WorkflowTriggerCondition {
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

export interface WorkflowTriggerConfiguration {
  eventName?: string;

  cronExpression?: string;

  webhookPath?: string;

  apiEndpoint?: string;

  conditions: WorkflowTriggerCondition[];

  metadata?: Record<
    string,
    unknown
  >;
}

export interface WorkflowTrigger {
  id: string;

  workflowId: string;

  name: string;

  type: WorkflowTriggerType;

  enabled: boolean;

  configuration: WorkflowTriggerConfiguration;

  createdAt: Date;

  updatedAt: Date;
}

export function isTriggerEnabled(
  trigger: WorkflowTrigger,
): boolean {
  return trigger.enabled;
}

export function hasConditions(
  trigger: WorkflowTrigger,
): boolean {
  return (
    trigger.configuration.conditions
      .length > 0
  );
}