/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a reusable AI prompt definition.
 * Prompt content is stored in AIPromptVersion.
 */

export type AIPromptStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type AIPromptCategory =
  | "system"
  | "instruction"
  | "conversation"
  | "classification"
  | "summarization"
  | "translation"
  | "extraction"
  | "reasoning"
  | "generation"
  | "validation"
  | "tool_calling"
  | "custom";

export interface AIPromptIdentity {

  displayName: string;

  shortName?: string;

  description?: string;

}

export interface AIPromptConfiguration {

  supportsVariables: boolean;

  supportsLocalization: boolean;

  supportsVersioning: boolean;

  reusableAcrossAgents: boolean;

}

export interface AIPromptMetadata {

  documentationUrl?: string;

  ownerUserId?: string;

  tags: string[];

}

export interface AIPrompt {

  id: string;

  tenantId: string;

  code: string;

  version: number;

  status: AIPromptStatus;

  category: AIPromptCategory;

  identity: AIPromptIdentity;

  configuration: AIPromptConfiguration;

  metadata: AIPromptMetadata;

  createdAt: string;

  updatedAt: string;

}