// website/lib/platform/domain/workflow.ts

/**
 * PatientPilot AI
 * Platform Domain
 * Workflow Aggregate Root
 *
 * The workflow is the orchestration engine that coordinates
 * business processes across CRM, AI, appointments,
 * notifications, follow-ups and future automation.
 */

export type WorkflowStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "failed";

export type WorkflowTriggerType =
  | "manual"
  | "event"
  | "schedule"
  | "webhook"
  | "api";

export interface WorkflowTrigger {
  id: string;

  type: WorkflowTriggerType;

  event?: string;

  configuration?: Record<
    string,
    unknown
  >;
}

export interface WorkflowMetadata {
  version: number;

  createdBy?: string;

  tags?: string[];

  description?: string;
}

export interface Workflow {
  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  code: string;

  status: WorkflowStatus;

  trigger: WorkflowTrigger;

  metadata: WorkflowMetadata;

  createdAt: Date;

  updatedAt: Date;
}