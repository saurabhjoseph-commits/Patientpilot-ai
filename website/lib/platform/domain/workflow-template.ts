/**
 * PP-002 Milestone C
 * Global Workflow Template Domain
 *
 * Represents a reusable workflow blueprint.
 */

export type WorkflowTemplateStatus =
  | "draft"
  | "active"
  | "inactive"
  | "deprecated";

export type WorkflowTemplateCategory =
  | "patient"
  | "appointment"
  | "conversation"
  | "treatment"
  | "billing"
  | "notification"
  | "integration"
  | "automation"
  | "custom";

export interface WorkflowTemplateVersion {

  major: number;

  minor: number;

  patch: number;

}

export interface WorkflowTemplateConfiguration {

  allowCustomization: boolean;

  autoStart: boolean;

  timeoutMinutes?: number;

}

export interface WorkflowTemplateMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface WorkflowTemplate {

  id: string;

  tenantId?: string;

  clinicId?: string;

  status: WorkflowTemplateStatus;

  category: WorkflowTemplateCategory;

  name: string;

  displayName: string;

  version: WorkflowTemplateVersion;

  configuration: WorkflowTemplateConfiguration;

  metadata: WorkflowTemplateMetadata;

  createdAt: string;

  updatedAt: string;

}