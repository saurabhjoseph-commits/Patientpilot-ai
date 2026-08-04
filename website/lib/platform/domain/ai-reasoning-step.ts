/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents an observable reasoning step
 * performed during an AI Generation.
 *
 * This entity intentionally stores execution
 * metadata only and does NOT persist private
 * model reasoning or chain-of-thought.
 */

export type AIReasoningStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type AIReasoningStepType =
  | "intent_detection"
  | "planning"
  | "retrieval_analysis"
  | "tool_selection"
  | "decision"
  | "validation"
  | "policy_check"
  | "response_review"
  | "custom";

export interface AIReasoningStepInputs {

  messageId?: string;

  retrievalResultIds: string[];

  toolExecutionIds: string[];

  memoryEntryIds: string[];

}

export interface AIReasoningStepDecision {

  outcome: string;

  confidence?: number;

  explanation?: string;

}

export interface AIReasoningStepPerformance {

  startedAt: string;

  completedAt?: string;

  durationMilliseconds?: number;

}

export interface AIReasoningStepMetadata {

  executionOrder: number;

  notes?: string;

  tags: string[];

}

export interface AIReasoningStep {

  id: string;

  sessionId: string;

  generationId: string;

  status: AIReasoningStepStatus;

  type: AIReasoningStepType;

  inputs: AIReasoningStepInputs;

  decision: AIReasoningStepDecision;

  performance: AIReasoningStepPerformance;

  metadata: AIReasoningStepMetadata;

  createdAt: string;

  updatedAt: string;

}