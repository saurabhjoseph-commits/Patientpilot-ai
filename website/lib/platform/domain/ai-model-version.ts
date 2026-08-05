/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a specific released version
 * of an AI model.
 */

export type AIModelVersionStatus =
  | "draft"
  | "preview"
  | "active"
  | "deprecated"
  | "retired";

export type AIModelVersionReleaseChannel =
  | "stable"
  | "preview"
  | "experimental"
  | "legacy";

export interface AIModelVersionLimits {

  maxContextTokens?: number;

  maxOutputTokens?: number;

  maxInputTokens?: number;

  maxImagesPerRequest?: number;

  maxAudioDurationSeconds?: number;

  maxVideoDurationSeconds?: number;

}

export interface AIModelVersionPricing {

  inputCostPerMillionTokens?: number;

  outputCostPerMillionTokens?: number;

  cachedInputCostPerMillionTokens?: number;

  imageGenerationCost?: number;

  audioInputCost?: number;

  audioOutputCost?: number;

  currency: string;

}

export interface AIModelVersionFeatures {

  supportsStreaming: boolean;

  supportsToolCalling: boolean;

  supportsStructuredOutput: boolean;

  supportsJsonMode: boolean;

  supportsVision: boolean;

  supportsAudioInput: boolean;

  supportsAudioOutput: boolean;

  supportsImageGeneration: boolean;

  supportsVideoGeneration: boolean;

  supportsEmbeddings: boolean;

  supportsFineTuning: boolean;

}

export interface AIModelVersionLifecycle {

  releasedAt?: string;

  deprecatedAt?: string;

  retiredAt?: string;

  endOfSupportAt?: string;

}

export interface AIModelVersionMetadata {

  displayName: string;

  providerModelId: string;

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface AIModelVersion {

  id: string;

  code: string;

  version: number;

  modelId: string;

  status: AIModelVersionStatus;

  releaseChannel: AIModelVersionReleaseChannel;

  limits: AIModelVersionLimits;

  pricing: AIModelVersionPricing;

  features: AIModelVersionFeatures;

  lifecycle: AIModelVersionLifecycle;

  metadata: AIModelVersionMetadata;

  createdAt: string;

  updatedAt: string;

}