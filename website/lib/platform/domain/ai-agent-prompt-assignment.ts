/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents the assignment of a prompt version
 * to an AI agent version.
 */

export type AIAgentPromptAssignmentStatus =
  | "active"
  | "disabled"
  | "deprecated";

export type AIAgentPromptRole =
  | "system"
  | "greeting"
  | "conversation"
  | "instruction"
  | "reasoning"
  | "extraction"
  | "validation"
  | "summarization"
  | "tool_calling"
  | "fallback"
  | "custom";

export interface AIAgentPromptConfiguration {

  enabled: boolean;

  required: boolean;

  allowOverride: boolean;

  stopExecutionOnFailure: boolean;

}

export interface AIAgentPromptExecution {

  executionOrder: number;

  runOncePerSession: boolean;

  runEveryTurn: boolean;

  runCondition?: string;

}

export interface AIAgentPromptLifecycle {

  effectiveFrom?: string;

  effectiveUntil?: string;

}

export interface AIAgentPromptMetadata {

  notes?: string;

  tags: string[];

}

export interface AIAgentPromptAssignment {

  id: string;

  agentVersionId: string;

  promptVersionId: string;

  status: AIAgentPromptAssignmentStatus;

  role: AIAgentPromptRole;

  configuration: AIAgentPromptConfiguration;

  execution: AIAgentPromptExecution;

  lifecycle: AIAgentPromptLifecycle;

  metadata: AIAgentPromptMetadata;

  createdAt: string;

  updatedAt: string;

}