/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a quality evaluation of an
 * AI Generation or AI Session.
 */

export type AIEvaluationStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type AIEvaluationType =
  | "automated"
  | "human"
  | "llm_judge"
  | "benchmark"
  | "regression"
  | "custom";

export type AIEvaluationOutcome =
  | "passed"
  | "warning"
  | "failed"
  | "inconclusive";

export interface AIEvaluationTarget {

  sessionId?: string;

  generationId?: string;

  messageId?: string;

}

export interface AIEvaluationMetrics {

  accuracy?: number;

  relevance?: number;

  groundedness?: number;

  completeness?: number;

  coherence?: number;

  safety?: number;

  policyCompliance?: number;

  latencyScore?: number;

  costEfficiency?: number;

  overallScore: number;

}

export interface AIEvaluationReviewer {

  evaluatorType: AIEvaluationType;

  evaluatorId?: string;

  evaluatorVersion?: string;

}

export interface AIEvaluationPerformance {

  startedAt: string;

  completedAt?: string;

  durationMilliseconds?: number;

}

export interface AIEvaluationMetadata {

  benchmarkName?: string;

  benchmarkVersion?: string;

  notes?: string;

  tags: string[];

}

export interface AIEvaluation {

  id: string;

  status: AIEvaluationStatus;

  outcome: AIEvaluationOutcome;

  target: AIEvaluationTarget;

  reviewer: AIEvaluationReviewer;

  metrics: AIEvaluationMetrics;

  performance: AIEvaluationPerformance;

  metadata: AIEvaluationMetadata;

  createdAt: string;

  updatedAt: string;

}