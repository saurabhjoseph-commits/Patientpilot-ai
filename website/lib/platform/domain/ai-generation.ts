/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a single Large Language Model
 * inference executed during an AI Session.
 */

export type AIGenerationStatus =
  | "queued"
  | "running"
  | "completed"
  | "cancelled"
  | "failed"
  | "timed_out";

export type AIGenerationType =
  | "completion"
  | "chat_completion"
  | "tool_call"
  | "structured_output"
  | "streaming"
  | "embedding"
  | "moderation"
  | "reasoning"
  | "custom";

export type AIGenerationFinishReason =
  | "completed"
  | "stop"
  | "length"
  | "tool_call"
  | "content_filter"
  | "cancelled"
  | "error"
  | "unknown";

export interface AIGenerationConfiguration {

  temperature?: number;

  topP?: number;

  maxTokens?: number;

  frequencyPenalty?: number;

  presencePenalty?: number;

  stopSequences?: string[];

}

export interface AIGenerationPrompt {

  promptVersionId?: string;

  systemPromptVersionId?: string;

  promptChecksum?: string;

}

export interface AIGenerationUsage {

  promptTokens?: number;

  completionTokens?: number;

  reasoningTokens?: number;

  totalTokens?: number;

  estimatedCost?: number;

}

export interface AIGenerationPerformance {

  startedAt: string;

  completedAt?: string;

  latencyMilliseconds?: number;

}

export interface AIGenerationOutput {

  finishReason: AIGenerationFinishReason;

  outputMessageId?: string;

  rawResponseId?: string;

}

export interface AIGenerationMetadata {

  retryNumber: number;

  fallbackGenerationId?: string;

  notes?: string;

  tags: string[];

}

export interface AIGeneration {

  id: string;

  sessionId: string;

  messageId: string;

  modelVersionId: string;

  status: AIGenerationStatus;

  type: AIGenerationType;

  configuration: AIGenerationConfiguration;

  prompt: AIGenerationPrompt;

  usage: AIGenerationUsage;

  performance: AIGenerationPerformance;

  output: AIGenerationOutput;

  metadata: AIGenerationMetadata;

  createdAt: string;

  updatedAt: string;

}