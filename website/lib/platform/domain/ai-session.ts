/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a runtime AI interaction.
 *
 * AISession is the root aggregate for:
 * - AI Messages
 * - AI Generations
 * - AI Tool Executions
 * - AI Reasoning
 * - Memory Usage
 * - Knowledge Retrieval
 * - Evaluations
 */

export type AISessionStatus =
  | "starting"
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "failed"
  | "expired";

export type AISessionChannel =
  | "voice"
  | "chat"
  | "sms"
  | "whatsapp"
  | "email"
  | "web"
  | "mobile"
  | "api"
  | "custom";

export interface AISessionParticipant {

  patientId?: string;

  providerId?: string;

  userId?: string;

  conversationId?: string;

}

export interface AISessionContext {

  tenantId: string;

  clinicId?: string;

  locationId?: string;

  language: string;

  timezone?: string;

}

export interface AISessionRuntime {

  agentVersionId: string;

  modelVersionId?: string;

  memoryId?: string;

  knowledgeBaseVersionId?: string;

}

export interface AISessionUsage {

  inputTokens?: number;

  outputTokens?: number;

  totalTokens?: number;

  totalCost?: number;

}

export interface AISessionLifecycle {

  startedAt: string;

  endedAt?: string;

  lastActivityAt?: string;

  expiresAt?: string;

}

export interface AISessionMetadata {

  externalSessionId?: string;

  sourceSystem?: string;

  tags: string[];

}

export interface AISession {

  id: string;

  status: AISessionStatus;

  channel: AISessionChannel;

  participant: AISessionParticipant;

  context: AISessionContext;

  runtime: AISessionRuntime;

  usage: AISessionUsage;

  lifecycle: AISessionLifecycle;

  metadata: AISessionMetadata;

  createdAt: string;

  updatedAt: string;

}