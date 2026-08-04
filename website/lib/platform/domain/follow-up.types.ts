// website/lib/platform/domain/follow-up.types.ts

/**
 * PatientPilot AI
 * Platform Domain
 * Follow-up Types
 *
 * Pure domain contracts.
 * No infrastructure, database or provider dependencies.
 */

export type FollowUpChannel =
  | "sms"
  | "email"
  | "voice"
  | "whatsapp"
  | "push";

export type FollowUpStatus =
  | "draft"
  | "scheduled"
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export type FollowUpPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type FollowUpTrigger =
  | "appointment-booked"
  | "appointment-reminder"
  | "appointment-confirmation"
  | "appointment-missed"
  | "appointment-cancelled"
  | "appointment-rescheduled"
  | "missed-call"
  | "new-lead"
  | "review-request"
  | "recall"
  | "reactivation"
  | "manual"
  | "workflow";

export interface FollowUpRecipient {
  patientId?: string;
  leadId?: string;

  firstName?: string;
  lastName?: string;

  email?: string;
  phone?: string;

  timezone?: string;
  locale?: string;
}

export interface FollowUpContent {
  subject?: string;

  message: string;

  templateId?: string;

  variables?: Record<string, unknown>;
}

export interface FollowUpSchedule {
  scheduledAt: Date;

  timezone: string;

  sendImmediately: boolean;
}

export interface RetryPolicy {
  enabled: boolean;

  maxAttempts: number;

  retryIntervalMinutes: number;

  exponentialBackoff: boolean;
}

export interface FollowUpMetadata {
  createdBy?: string;

  workflowId?: string;

  campaignId?: string;

  clinicId: string;

  tenantId: string;

  tags?: string[];

  custom?: Record<string, unknown>;
}

export interface FollowUpExecutionContext {
  executionId: string;

  attempt: number;

  startedAt: Date;

  provider?: string;

  correlationId?: string;
}

export interface FollowUpExecutionResult {
  success: boolean;

  completedAt: Date;

  providerMessageId?: string;

  provider?: string;

  status: FollowUpStatus;

  errorCode?: string;

  errorMessage?: string;

  metadata?: Record<string, unknown>;
}

export interface FollowUp {
  id: string;

  trigger: FollowUpTrigger;

  priority: FollowUpPriority;

  status: FollowUpStatus;

  channel: FollowUpChannel;

  recipient: FollowUpRecipient;

  content: FollowUpContent;

  schedule: FollowUpSchedule;

  retryPolicy: RetryPolicy;

  metadata: FollowUpMetadata;

  createdAt: Date;

  updatedAt: Date;
}

export interface FollowUpExecutor {
  execute(
    followUp: FollowUp,
    context: FollowUpExecutionContext,
  ): Promise<FollowUpExecutionResult>;
}

export interface FollowUpScheduler {
  schedule(
    followUp: FollowUp,
  ): Promise<void>;

  cancel(
    followUpId: string,
  ): Promise<void>;

  reschedule(
    followUpId: string,
    schedule: FollowUpSchedule,
  ): Promise<void>;
}

export interface FollowUpRepository {
  create(
    followUp: FollowUp,
  ): Promise<FollowUp>;

  update(
    followUp: FollowUp,
  ): Promise<FollowUp>;

  findById(
    id: string,
  ): Promise<FollowUp | null>;

  findPending(
    before: Date,
  ): Promise<FollowUp[]>;

  delete(
    id: string,
  ): Promise<void>;
}

export interface FollowUpExecutionService {
  execute(
    followUpId: string,
  ): Promise<FollowUpExecutionResult>;
}