/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a reusable AI capability that can be
 * supported by one or more AI models and versions.
 */

export type AIModelCapabilityStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type AIModelCapabilityCategory =
  | "reasoning"
  | "language"
  | "vision"
  | "audio"
  | "video"
  | "image_generation"
  | "speech"
  | "embeddings"
  | "tool_calling"
  | "structured_output"
  | "fine_tuning"
  | "moderation"
  | "code_execution"
  | "search"
  | "memory"
  | "multimodal"
  | "custom";

export interface AIModelCapabilityRequirements {

  requiredCapabilityCodes: string[];

  incompatibleCapabilityCodes: string[];

}

export interface AIModelCapabilityMetadata {

  displayName: string;

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface AIModelCapability {

  id: string;

  code: string;

  version: number;

  status: AIModelCapabilityStatus;

  category: AIModelCapabilityCategory;

  requirements: AIModelCapabilityRequirements;

  metadata: AIModelCapabilityMetadata;

  createdAt: string;

  updatedAt: string;

}