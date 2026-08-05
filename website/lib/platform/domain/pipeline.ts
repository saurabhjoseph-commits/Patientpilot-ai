/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a configurable sales pipeline.
 * Pipelines define the sales process and contain
 * one or more Pipeline Stages.
 */

export type PipelineCategory =
  | "sales"
  | "marketing"
  | "patient_journey"
  | "billing"
  | "workflow"
  | "custom";

export interface PipelineSettings {

  isDefault: boolean;

  allowStageSkipping: boolean;

  autoCloseWon: boolean;

  autoCloseLost: boolean;

}

export interface PipelineMetadata {

  description?: string;

  color?: string;

  icon?: string;

  archived: boolean;

  externalId?: string;

}

export interface Pipeline {

  id: string;

  tenantId: string;

  clinicId: string;

  category: PipelineCategory;

  name: string;

  settings: PipelineSettings;

  metadata: PipelineMetadata;

  createdAt: string;

  updatedAt: string;

}