/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents an AI service provider that offers
 * one or more AI models.
 */

export type AIProviderStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type AIProviderCategory =
  | "cloud"
  | "enterprise"
  | "open_source"
  | "self_hosted"
  | "custom";

export interface AIProviderCapabilities {

  supportsChat: boolean;

  supportsVision: boolean;

  supportsAudio: boolean;

  supportsSpeech: boolean;

  supportsEmbeddings: boolean;

  supportsImageGeneration: boolean;

  supportsVideoGeneration: boolean;

  supportsToolCalling: boolean;

  supportsStructuredOutput: boolean;

  supportsStreaming: boolean;

  supportsFineTuning: boolean;

}

export interface AIProviderCompliance {

  certifications: string[];

  supportedRegions: string[];

  dataResidencySupported: boolean;

  hipaaEligible: boolean;

  gdprSupported: boolean;

  soc2Supported: boolean;

}

export interface AIProviderMetadata {

  displayName: string;

  description?: string;

  website?: string;

  documentationUrl?: string;

  supportUrl?: string;

  logoUrl?: string;

  tags: string[];

}

export interface AIProvider {

  id: string;

  code: string;

  version: number;

  status: AIProviderStatus;

  category: AIProviderCategory;

  capabilities: AIProviderCapabilities;

  compliance: AIProviderCompliance;

  metadata: AIProviderMetadata;

  createdAt: string;

  updatedAt: string;

}