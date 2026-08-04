/**
 * PP-002 Milestone C
 * Global Automation Domain
 *
 * Represents a configurable automation
 * that starts workflows or executes actions.
 */

export type AutomationStatus =
  | "draft"
  | "active"
  | "inactive"
  | "paused"
  | "archived";

export type AutomationTriggerType =
  | "event"
  | "schedule"
  | "manual"
  | "webhook"
  | "api"
  | "system";

export interface AutomationTrigger {

  type: AutomationTriggerType;

  eventName?: string;

  schedule?: string;

  webhookEvent?: string;

}

export interface AutomationCondition {

  expression?: string;

  description?: string;

}

export interface AutomationAction {

  workflowTemplateId?: string;

  jobType?: string;

  notificationType?: string;

  integrationId?: string;

}

export interface AutomationExecution {

  enabled: boolean;

  runOnce: boolean;

  maxExecutions?: number;

  executionCount: number;

  lastExecutedAt?: string;

  nextExecutionAt?: string;

}

export interface AutomationMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Automation {

  id: string;

  tenantId: string;

  clinicId?: string;

  status: AutomationStatus;

  name: string;

  trigger: AutomationTrigger;

  condition: AutomationCondition;

  action: AutomationAction;

  execution: AutomationExecution;

  metadata: AutomationMetadata;

  createdAt: string;

  updatedAt: string;

}