// website/lib/platform/domain/workflow-step-execution.ts

/**
 * PatientPilot AI
 * Workflow Step Execution
 *
 * Runtime execution state for an individual workflow step.
 */

export type WorkflowStepExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "cancelled";

export interface WorkflowStepExecutionError {
  code: string;

  message: string;

  occurredAt: Date;

  details?: Record<string, unknown>;
}

export interface WorkflowStepExecution {
  id: string;

  workflowExecutionId: string;

  workflowStepId: string;

  status: WorkflowStepExecutionStatus;

  startedAt?: Date;

  completedAt?: Date;

  durationMs?: number;

  input?: Record<string, unknown>;

  output?: Record<string, unknown>;

  errors: WorkflowStepExecutionError[];

  metadata?: Record<string, unknown>;
}

export function isStepFinished(
  execution: WorkflowStepExecution,
): boolean {
  return (
    execution.status === "completed" ||
    execution.status === "failed" ||
    execution.status === "skipped" ||
    execution.status === "cancelled"
  );
}

export function addStepError(
  execution: WorkflowStepExecution,
  error: WorkflowStepExecutionError,
): WorkflowStepExecution {
  return {
    ...execution,
    errors: [...execution.errors, error],
  };
}

export function completeStep(
  execution: WorkflowStepExecution,
  output?: Record<string, unknown>,
): WorkflowStepExecution {
  const completedAt = new Date();

  return {
    ...execution,
    status: "completed",
    completedAt,
    durationMs:
      execution.startedAt != null
        ? completedAt.getTime() -
          execution.startedAt.getTime()
        : undefined,
    output,
  };
}