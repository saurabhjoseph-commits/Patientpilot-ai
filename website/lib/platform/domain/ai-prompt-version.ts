/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a versioned executable AI prompt.
 */

export type AIPromptVersionStatus =
  | "draft"
  | "testing"
  | "active"
  | "deprecated"
  | "retired";

export type AIPromptVersionReleaseChannel =
  | "development"
  | "staging"
  | "production"
  | "preview";

export interface AIPromptVariableDefinition {

  name: string;

  description?: string;

  required: boolean;

  type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "datetime"
    | "object"
    | "array";

  defaultValue?: string;

}

export interface AIPromptOutputDefinition {

  format:
    | "text"
    | "markdown"
    | "json"
    | "html"
    | "xml"
    | "custom";

  schemaVersion?: string;

  structuredOutputRequired: boolean;

}

export interface AIPromptModelParameters {

  temperature?: number;

  topP?: number;

  maxOutputTokens?: number;

  frequencyPenalty?: number;

  presencePenalty?: number;

  stopSequences: string[];

}

export interface AIPromptLifecycle {

  publishedAt?: string;

  effectiveFrom?: string;

  effectiveUntil?: string;

  deprecatedAt?: string;

  retiredAt?: string;

}

export interface AIPromptVersionMetadata {

  displayName: string;

  description?: string;

  changelog?: string;

  tags: string[];

}

export interface AIPromptVersion {

  id: string;

  code: string;

  version: number;

  promptId: string;

  status: AIPromptVersionStatus;

  releaseChannel: AIPromptVersionReleaseChannel;

  systemPrompt: string;

  userPromptTemplate?: string;

  assistantPromptTemplate?: string;

  variables: AIPromptVariableDefinition[];

  output: AIPromptOutputDefinition;

  modelParameters: AIPromptModelParameters;

  lifecycle: AIPromptLifecycle;

  metadata: AIPromptVersionMetadata;

  createdAt: string;

  updatedAt: string;

}