/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a single runtime execution of an
 * external tool initiated by an AI Generation.
 */

export type AIToolExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "timed_out";

export type AIToolExecutionType =
  | "api"
  | "database"
  | "integration"
  | "workflow"
  | "function"
  | "search"
  | "retrieval"
  | "notification"
  | "custom";

export interface AIToolExecutionRequest {

  toolName: string;

  toolVersion?: string;

  operation?: string;

  input: Record<string, unknown>;

}

export interface AIToolExecutionResponse {

  success: boolean;

  output?: Record<string, unknown>;

  errorCode?: string;

  errorMessage?: string;

}

export interface AIToolExecutionPerformance {

  startedAt: string;

  completedAt?: string;

  latencyMilliseconds?: number;

  retryCount: number;

}

export interface AIToolExecutionSecurity {

  executedByAgentVersionId?: string;

  authenticationMethod?: string;

  authorizationContext?: string;

}

export interface AIToolExecutionMetadata {

  externalExecutionId?: string;

  correlationId?: string;

  notes?: string;

  tags: string[];

}

export interface AIToolExecution {

  id: string;

  sessionId: string;

  messageId: string;

  generationId: string;

  status: AIToolExecutionStatus;

  type: AIToolExecutionType;

  request: AIToolExecutionRequest;

  response: AIToolExecutionResponse;

  performance: AIToolExecutionPerformance;

  security: AIToolExecutionSecurity;

  metadata: AIToolExecutionMetadata;

  createdAt: string;

  updatedAt: string;

}