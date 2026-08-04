/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a logical AI Memory Store.
 *
 * Individual memories are stored in
 * AIMemoryEntry.
 */

export type AIMemoryStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type AIMemoryCategory =
  | "short_term"
  | "long_term"
  | "episodic"
  | "semantic"
  | "working"
  | "user_profile"
  | "conversation"
  | "knowledge_cache"
  | "custom";

export interface AIMemoryIdentity {

  displayName: string;

  shortName?: string;

  description?: string;

}

export interface AIMemoryConfiguration {

  supportsExpiration: boolean;

  supportsImportanceScoring: boolean;

  supportsSummarization: boolean;

  supportsSemanticSearch: boolean;

  supportsEncryption: boolean;

}

export interface AIMemoryRetention {

  defaultRetentionDays?: number;

  automaticCleanup: boolean;

  archiveBeforeDeletion: boolean;

}

export interface AIMemoryMetadata {

  ownerUserId?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface AIMemory {

  id: string;

  tenantId: string;

  code: string;

  version: number;

  status: AIMemoryStatus;

  category: AIMemoryCategory;

  identity: AIMemoryIdentity;

  configuration: AIMemoryConfiguration;

  retention: AIMemoryRetention;

  metadata: AIMemoryMetadata;

  createdAt: string;

  updatedAt: string;

}