// website/lib/platform/domain/workflow-step.ts

/**
 * PatientPilot AI
 * Workflow Step
 *
 * Represents a single executable step within
 * a workflow definition.
 */

export type WorkflowStepType =
  | "action"
  | "condition"
  | "delay"
  | "approval"
  | "parallel"
  | "subworkflow"
  | "terminal";

export type WorkflowActionType =
  | "createLead"
  | "updateLead"
  | "createOpportunity"
  | "updateOpportunity"
  | "scheduleFollowUp"
  | "sendNotification"
  | "bookAppointment"
  | "assignUser"
  | "invokeAI"
  | "callWebhook"
  | "runFunction";

export interface WorkflowStepConfiguration {
  action?: WorkflowActionType;

  timeoutSeconds?: number;

  retryAttempts?: number;

  continueOnFailure?: boolean;

  parameters?: Record<
    string,
    unknown
  >;
}

export interface WorkflowStep {
  id: string;

  workflowDefinitionId: string;

  code: string;

  name: string;

  description?: string;

  type: WorkflowStepType;

  order: number;

  enabled: boolean;

  configuration: WorkflowStepConfiguration;

  createdAt: Date;

  updatedAt: Date;
}

export function isExecutableStep(
  step: WorkflowStep,
): boolean {
  return (
    step.enabled &&
    step.type !== "terminal"
  );
}

export function requiresRetry(
  step: WorkflowStep,
): boolean {
  return (
    (step.configuration.retryAttempts ??
      0) > 0
  );
}