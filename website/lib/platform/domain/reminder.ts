/**
 * PP-004 Communication & Engagement Domain
 *
 * Aggregate root representing
 * a business reminder.
 *
 * A reminder defines WHAT should
 * be reminded and WHEN.
 *
 * Notification entities represent
 * the delivery attempts generated
 * from this reminder.
 */

export type ReminderCategory =
  | "appointment"
  | "recall"
  | "treatment"
  | "follow_up"
  | "billing"
  | "payment"
  | "medication"
  | "review_request"
  | "survey"
  | "custom";

export type ReminderStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled"
  | "expired";

export type ReminderPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface ReminderRecipient {

  ownerType:
    | "patient"
    | "lead"
    | "customer";

  ownerId: string;

}

export interface ReminderSchedule {

  scheduledFor: string;

  timezone: string;

  recurrenceRule?: string;

}

export interface ReminderReference {

  appointmentId?: string;

  treatmentPlanId?: string;

  invoiceId?: string;

  workflowExecutionId?: string;

}

export interface ReminderExecution {

  notificationCount: number;

  lastNotificationAt?: string;

  completedAt?: string;

}

export interface ReminderMetadata {

  notes?: string;

  externalId?: string;

}

export interface Reminder {

  id: string;

  tenantId: string;

  clinicId: string;

  category: ReminderCategory;

  priority: ReminderPriority;

  status: ReminderStatus;

  recipient: ReminderRecipient;

  schedule: ReminderSchedule;

  reference: ReminderReference;

  execution: ReminderExecution;

  metadata: ReminderMetadata;

  createdAt: string;

  updatedAt: string;

}