/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a logical AI model offered by
 * an AI provider.
 */

export type AIModelStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type AIModelCategory =
  | "chat"
  | "reasoning"
  | "vision"
  | "speech_to_text"
  | "text_to_speech"
  | "image_generation"
  | "video_generation"
  | "embedding"
  | "moderation"
  | "multimodal"
  | "custom";

export interface AIModelCapabilities {

  supportsStreaming: boolean;

  supportsToolCalling: boolean;

  supportsStructuredOutput: boolean;

  supportsFunctionCalling: boolean;

  supportsJsonMode: boolean;

  supportsVision: boolean;

  supportsAudioInput: boolean;

  supportsAudioOutput: boolean;

  supportsImages: boolean;

  supportsVideo: boolean;

  supportsEmbeddings: boolean;

  supportsFineTuning: boolean;

}

export interface AIModelLimits {

  maxContextTokens?: number;

  maxOutputTokens?: number;

  maxInputCharacters?: number;

  supportsBatchProcessing: boolean;

}

export interface AIModelMetadata {

  displayName: string;

  description?: string;

  releaseChannel?:
    | "stable"
    | "preview"
    | "experimental"
    | "legacy";

  tags: string[];

}

export interface AIModel {

  id: string;

  code: string;

  version: number;

  providerId: string;

  status: AIModelStatus;

  category: AIModelCategory;

  capabilities: AIModelCapabilities;

  limits: AIModelLimits;

  metadata: AIModelMetadata;

  createdAt: string;

  updatedAt: string;

}