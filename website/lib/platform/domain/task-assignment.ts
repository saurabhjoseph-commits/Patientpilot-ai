/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents the runtime assignment of a Task.
 *
 * Assignments are historical records and may change
 * over time without modifying the original Task.
 */

export type TaskAssignmentType =
  | "user"
  | "team"
  | "queue"
  | "ai_agent"
  | "system";

export type TaskAssignmentStatus =
  | "assigned"
  | "accepted"
  | "in_progress"
  | "completed"
  | "declined"
  | "reassigned"
  | "cancelled";

export interface TaskAssignmentTarget {

  userId?: string;

  teamId?: string;

  queueId?: string;

  aiAgentId?: string;

}

export interface TaskAssignmentDates {

  assignedAt: string;

  acceptedAt?: string;

  startedAt?: string;

  completedAt?: string;

  cancelledAt?: string;

}

export interface TaskAssignmentMetadata {

  priority?: number;

  reason?: string;

  notes?: string;

  externalId?: string;

}

export interface TaskAssignment {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  taskId: string;

  assignmentType: TaskAssignmentType;

  status: TaskAssignmentStatus;

  target: TaskAssignmentTarget;

  dates: TaskAssignmentDates;

  metadata: TaskAssignmentMetadata;

  createdByUserId?: string;

  createdAt: string;

  updatedAt: string;

}