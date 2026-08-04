/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Immutable history of stage transitions for an opportunity.
 * Used for audit trails, sales analytics, reporting,
 * SLA tracking, and AI insights.
 */

export type OpportunityStageAction =
  | "created"
  | "entered"
  | "exited"
  | "reopened"
  | "won"
  | "lost"
  | "cancelled";

export interface OpportunityStageDuration {
  enteredAt: string;
  exitedAt?: string;
  durationMinutes?: number;
}

export interface OpportunityStageChangedBy {
  userId?: string;
  aiAgentId?: string;
  system?: boolean;
}

export interface OpportunityStageMetadata {
  reason?: string;
  notes?: string;
  aiConversationId?: string;
  externalId?: string;
}

export interface OpportunityStageHistory {

  id: string;

  tenantId: string;

  clinicId: string;

  opportunityId: string;

  stageId: string;

  stageName: string;

  action: OpportunityStageAction;

  previousStageId?: string;

  previousStageName?: string;

  changedBy: OpportunityStageChangedBy;

  duration: OpportunityStageDuration;

  metadata: OpportunityStageMetadata;

  createdAt: string;

}