/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents the final governance decision
 * for an AI execution after safety, policy,
 * and quality validation.
 */

export type AIGovernanceDecisionStatus =
  | "pending"
  | "completed"
  | "overridden";

export type AIGovernanceDecisionOutcome =
  | "approved"
  | "approved_with_warnings"
  | "modified"
  | "redacted"
  | "retry"
  | "fallback_model"
  | "escalate_to_human"
  | "blocked"
  | "rejected";

export interface AIGovernanceDecisionTarget {

  sessionId?: string;

  generationId?: string;

  messageId?: string;

}

export interface AIGovernanceDecisionInputs {

  safetyCheckIds: string[];

  evaluationIds: string[];

  reasoningStepIds: string[];

  policyExecutionIds: string[];

}

export interface AIGovernanceDecisionAction {

  outcome: AIGovernanceDecisionOutcome;

  reason: string;

  nextAction?: string;

}

export interface AIGovernanceDecisionApprover {

  decisionEngine: string;

  decisionEngineVersion?: string;

  overriddenByUserId?: string;

  overriddenAt?: string;

}

export interface AIGovernanceDecisionPerformance {

  decidedAt: string;

  durationMilliseconds?: number;

}

export interface AIGovernanceDecisionMetadata {

  governancePolicyVersion?: string;

  notes?: string;

  tags: string[];

}

export interface AIGovernanceDecision {

  id: string;

  status: AIGovernanceDecisionStatus;

  target: AIGovernanceDecisionTarget;

  inputs: AIGovernanceDecisionInputs;

  action: AIGovernanceDecisionAction;

  approver: AIGovernanceDecisionApprover;

  performance: AIGovernanceDecisionPerformance;

  metadata: AIGovernanceDecisionMetadata;

  createdAt: string;

  updatedAt: string;

}