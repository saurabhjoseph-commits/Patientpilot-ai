/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a reusable follow-up sequence
 * definition.
 *
 * A FollowUpSequence can be executed many times
 * for different Leads, Opportunities, Patients
 * or Customers.
 */

export type FollowUpSequenceStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived";

export type FollowUpSequenceTrigger =
  | "manual"
  | "lead_created"
  | "opportunity_created"
  | "quote_sent"
  | "estimate_shared"
  | "appointment_missed"
  | "appointment_completed"
  | "deal_created"
  | "custom";

export interface FollowUpSequenceStep {

  id: string;

  order: number;

  delayHours: number;

  workflowId: string;

}

export interface FollowUpSequenceSettings {

  allowParallelExecution: boolean;

  stopOnReply: boolean;

  stopOnConversion: boolean;

  maxExecutionsPerEntity?: number;

}

export interface FollowUpSequenceMetadata {

  description?: string;

  category?: string;

  tags: string[];

  externalId?: string;

  archived: boolean;

}

export interface FollowUpSequence {

  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  status: FollowUpSequenceStatus;

  trigger: FollowUpSequenceTrigger;

  steps: FollowUpSequenceStep[];

  settings: FollowUpSequenceSettings;

  metadata: FollowUpSequenceMetadata;

  createdAt: string;

  updatedAt: string;

}