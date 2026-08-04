/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a versioned configuration
 * of an AI agent.
 */

export type AIAgentVersionStatus =
  | "draft"
  | "testing"
  | "active"
  | "deprecated"
  | "retired";

export type AIAgentVersionReleaseChannel =
  | "development"
  | "staging"
  | "production"
  | "preview";

export interface AIAgentVersionExecutionPolicy {

  allowAutonomousExecution: boolean;

  requireHumanApproval: boolean;

  allowParallelToolExecution: boolean;

  maxConversationTurns?: number;

  maxExecutionDurationSeconds?: number;

}

export interface AIAgentVersionFallbackPolicy {

  enableFallbackModel: boolean;

  fallbackAgentVersionId?: string;

  maxRetryAttempts: number;

}

export interface AIAgentVersionLifecycle {

  effectiveFrom?: string;

  effectiveUntil?: string;

  publishedAt?: string;

  deprecatedAt?: string;

  retiredAt?: string;

}

export interface AIAgentVersionMetadata {

  displayName: string;

  description?: string;

  changelog?: string;

  tags: string[];

}

export interface AIAgentVersion {

  id: string;

  code: string;

  version: number;

  agentId: string;

  modelVersionId?: string;

  status: AIAgentVersionStatus;

  releaseChannel: AIAgentVersionReleaseChannel;

  executionPolicy: AIAgentVersionExecutionPolicy;

  fallbackPolicy: AIAgentVersionFallbackPolicy;

  lifecycle: AIAgentVersionLifecycle;

  metadata: AIAgentVersionMetadata;

  createdAt: string;

  updatedAt: string;

}