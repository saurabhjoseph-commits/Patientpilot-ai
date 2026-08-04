/**
 * PP-002 Milestone A
 * Global Task Domain
 *
 * Represents work assigned to a staff member,
 * AI agent, or automation workflow.
 */

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export type TaskPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export type TaskType =
  | "call_patient"
  | "confirm_appointment"
  | "reschedule_appointment"
  | "verify_insurance"
  | "review_ai_conversation"
  | "follow_up"
  | "collect_documents"
  | "payment"
  | "clinical"
  | "administrative"
  | "custom";

export type TaskAssigneeType =
  | "staff"
  | "provider"
  | "ai"
  | "system";

export interface TaskAssignee {

  type: TaskAssigneeType;

  id?: string;

  name?: string;

}

export interface TaskReference {

  patientId?: string;

  appointmentId?: string;

  conversationId?: string;

  treatmentId?: string;

}

export interface TaskMetadata {

  description?: string;

  notes?: string;

  externalId?: string;

}

export interface Task {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  status: TaskStatus;

  priority: TaskPriority;

  type: TaskType;

  title: string;

  assignee: TaskAssignee;

  reference: TaskReference;

  dueAt?: string;

  completedAt?: string;

  metadata: TaskMetadata;

  createdAt: string;

  updatedAt: string;

}