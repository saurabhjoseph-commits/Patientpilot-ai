/**
 * PP-002 Milestone C
 * Global Automation Execution Domain
 *
 * Represents a single execution of
 * an automation.
 */

export type AutomationExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "skipped";

export interface AutomationExecutionTrigger {

  type: string;

  source?: string;

  eventName?: string;

  triggeredAt: string;

}

export interface AutomationExecutionReference {

  workflowId?: string;

  workflowTemplateId?: string;

  jobId?: string;

  eventId?: string;

  notificationId?: string;

}

export interface AutomationExecutionResult {

  success?: boolean;

  output?: Record<string, unknown>;

  errorCode?: string;

  errorMessage?: string;

}

export interface AutomationExecutionMetrics {

  durationMs?: number;

  retryCount: number;

}

export interface AutomationExecutionMetadata {

  correlationId?: string;

  requestId?: string;

  traceId?: string;

}

export interface AutomationExecution {

  id: string;

  tenantId: string;

  clinicId?: string;

  automationId: string;

  status: AutomationExecutionStatus;

  trigger: AutomationExecutionTrigger;

  reference: AutomationExecutionReference;

  result: AutomationExecutionResult;

  metrics: AutomationExecutionMetrics;

  metadata: AutomationExecutionMetadata;

  startedAt?: string;

  completedAt?: string;

  createdAt: string;

  updatedAt: string;

}