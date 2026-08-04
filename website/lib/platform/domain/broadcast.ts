/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents a single execution
 * of a communication campaign.
 */

export type BroadcastStatus =
  | "scheduled"
  | "preparing"
  | "running"
  | "paused"
  | "completed"
  | "cancelled"
  | "failed";

export interface BroadcastSchedule {

  scheduledAt: string;

  startedAt?: string;

  completedAt?: string;

}

export interface BroadcastAudience {

  resolvedAudienceSize: number;

  successfulDeliveries: number;

  failedDeliveries: number;

  skippedRecipients: number;

}

export interface BroadcastChannels {

  channels: string[];

}

export interface BroadcastMetrics {

  delivered: number;

  opened?: number;

  clicked?: number;

  replied?: number;

  converted?: number;

}

export interface BroadcastExecution {

  executionId?: string;

  workflowExecutionId?: string;

  jobId?: string;

}

export interface BroadcastMetadata {

  initiatedByUserId?: string;

  notes?: string;

  tags: string[];

}

export interface Broadcast {

  id: string;

  tenantId: string;

  campaignId: string;

  name: string;

  status: BroadcastStatus;

  schedule: BroadcastSchedule;

  audience: BroadcastAudience;

  channels: BroadcastChannels;

  metrics: BroadcastMetrics;

  execution: BroadcastExecution;

  metadata: BroadcastMetadata;

  createdAt: string;

  updatedAt: string;

}