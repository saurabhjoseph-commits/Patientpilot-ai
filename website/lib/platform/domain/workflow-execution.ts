// website/lib/platform/domain/workflow-execution.ts

/**
 * PatientPilot AI
 * Workflow Execution
 *
 * Runtime execution state for a workflow instance.
 */

export type WorkflowExecutionStatus =
  | "pending"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "cancelled";

export interface WorkflowExecutionError {
  code: string;

  message: string;

  stepId?: string;

  occurredAt: Date;

  details?: Record<string, unknown>;
}

export interface WorkflowExecution {
  id: string;

  workflowDefinitionId: string;

  workflowId: string;

  tenantId: string;

  clinicId: string;

  status: WorkflowExecutionStatus;

  currentStepId?: string;

  startedAt: Date;

  completedAt?: Date;

  cancelledAt?: Date;

  variables: Record<
    string,
    unknown
  >;

  errors: WorkflowExecutionError[];

  metadata?: Record<
    string,
    unknown
  >;
}

export function isExecutionFinished(
  execution: WorkflowExecution,
): boolean {
  return (
    execution.status ===
      "completed" ||
    execution.status ===
      "failed" ||
    execution.status ===
      "cancelled"
  );
}

export function isExecutionRunning(
  execution: WorkflowExecution,
): boolean {
  return (
    execution.status ===
      "running"
  );
}

export function addExecutionError(
  execution: WorkflowExecution,
  error: WorkflowExecutionError,
): WorkflowExecution {
  return {
    ...execution,
    errors: [
      ...execution.errors,
      error,
    ],
  };
}