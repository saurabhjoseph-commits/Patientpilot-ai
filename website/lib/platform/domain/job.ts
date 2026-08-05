/**
 * PP-002 Milestone C
 * Global Job Domain
 *
 * Represents asynchronous work executed
 * by the platform.
 */

export type JobStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type JobPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type JobType =
  | "ai"
  | "webhook"
  | "notification"
  | "integration"
  | "analytics"
  | "report"
  | "scheduler"
  | "maintenance"
  | "custom";

export interface JobReference {

  eventId?: string;

  patientId?: string;

  appointmentId?: string;

  conversationId?: string;

  notificationId?: string;

  webhookId?: string;

  integrationId?: string;

}

export interface JobExecution {

  worker?: string;

  attempt: number;

  maxAttempts: number;

  startedAt?: string;

  completedAt?: string;

  nextRunAt?: string;

}

export interface JobPayload {

  version: string;

  data: Record<string, unknown>;

}

export interface JobResult {

  success?: boolean;

  output?: Record<string, unknown>;

  errorCode?: string;

  errorMessage?: string;

}

export interface JobMetadata {

  correlationId?: string;

  requestId?: string;

  traceId?: string;

}

export interface Job {

  id: string;

  tenantId: string;

  clinicId?: string;

  status: JobStatus;

  priority: JobPriority;

  type: JobType;

  name: string;

  reference: JobReference;

  execution: JobExecution;

  payload: JobPayload;

  result: JobResult;

  metadata: JobMetadata;

  createdAt: string;

  updatedAt: string;

}