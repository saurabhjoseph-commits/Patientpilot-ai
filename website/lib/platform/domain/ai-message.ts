/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a single message exchanged during
 * an AI Session.
 */

export type AIMessageStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "deleted";

export type AIMessageRole =
  | "system"
  | "user"
  | "assistant"
  | "tool"
  | "human_agent";

export type AIMessageContentType =
  | "text"
  | "markdown"
  | "json"
  | "html"
  | "audio"
  | "image"
  | "document"
  | "event"
  | "custom";

export interface AIMessageContent {

  type: AIMessageContentType;

  text?: string;

  structuredData?: Record<string, unknown>;

  attachments?: string[];

  language?: string;

}

export interface AIMessageContext {

  parentMessageId?: string;

  sequenceNumber: number;

  retryNumber?: number;

}

export interface AIMessageUsage {

  inputTokens?: number;

  outputTokens?: number;

  totalTokens?: number;

  estimatedCost?: number;

}

export interface AIMessageMetadata {

  externalMessageId?: string;

  sourceSystem?: string;

  tags: string[];

}

export interface AIMessageLifecycle {

  receivedAt?: string;

  processedAt?: string;

  deliveredAt?: string;

}

export interface AIMessage {

  id: string;

  sessionId: string;

  status: AIMessageStatus;

  role: AIMessageRole;

  content: AIMessageContent;

  context: AIMessageContext;

  usage: AIMessageUsage;

  metadata: AIMessageMetadata;

  lifecycle: AIMessageLifecycle;

  createdAt: string;

  updatedAt: string;

}