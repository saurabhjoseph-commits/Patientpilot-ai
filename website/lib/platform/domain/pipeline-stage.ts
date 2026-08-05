/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a configurable stage within a Pipeline.
 * Pipeline Stages define the ordered workflow that
 * Opportunities move through.
 */

export type PipelineStageType =
  | "normal"
  | "entry"
  | "success"
  | "failure";

export interface PipelineStageProbability {

  /**
   * Default probability (0-100)
   * used for forecasting.
   */
  percentage: number;

}

export interface PipelineStageSLA {

  /**
   * Expected maximum time
   * in this stage.
   */
  targetHours?: number;

}

export interface PipelineStageAutomation {

  enterWorkflowId?: string;

  exitWorkflowId?: string;

}

export interface PipelineStageMetadata {

  description?: string;

  color?: string;

  icon?: string;

  archived: boolean;

  externalId?: string;

}

export interface PipelineStage {

  id: string;

  tenantId: string;

  clinicId: string;

  pipelineId: string;

  name: string;

  type: PipelineStageType;

  sequence: number;

  probability: PipelineStageProbability;

  sla: PipelineStageSLA;

  automation: PipelineStageAutomation;

  metadata: PipelineStageMetadata;

  createdAt: string;

  updatedAt: string;

}