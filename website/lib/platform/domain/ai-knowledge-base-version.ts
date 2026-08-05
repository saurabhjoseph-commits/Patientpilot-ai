/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a versioned snapshot of an
 * AI Knowledge Base.
 */

export type AIKnowledgeBaseVersionStatus =
  | "draft"
  | "indexing"
  | "testing"
  | "active"
  | "deprecated"
  | "retired";

export type AIKnowledgeBaseReleaseChannel =
  | "development"
  | "staging"
  | "production"
  | "preview";

export type AIKnowledgeSearchStrategy =
  | "keyword"
  | "semantic"
  | "hybrid"
  | "vector";

export interface AIKnowledgeRetrievalConfiguration {

  searchStrategy: AIKnowledgeSearchStrategy;

  maxRetrievedDocuments: number;

  maxRetrievedChunks: number;

  minimumSimilarityScore?: number;

  rerankingEnabled: boolean;

}

export interface AIKnowledgeIndexConfiguration {

  embeddingModelVersionId?: string;

  chunkSize: number;

  chunkOverlap: number;

  automaticIndexing: boolean;

}

export interface AIKnowledgeLifecycle {

  publishedAt?: string;

  effectiveFrom?: string;

  effectiveUntil?: string;

  deprecatedAt?: string;

  retiredAt?: string;

}

export interface AIKnowledgeBaseVersionMetadata {

  displayName: string;

  description?: string;

  changelog?: string;

  tags: string[];

}

export interface AIKnowledgeBaseVersion {

  id: string;

  code: string;

  version: number;

  knowledgeBaseId: string;

  status: AIKnowledgeBaseVersionStatus;

  releaseChannel: AIKnowledgeBaseReleaseChannel;

  retrieval: AIKnowledgeRetrievalConfiguration;

  indexing: AIKnowledgeIndexConfiguration;

  lifecycle: AIKnowledgeLifecycle;

  metadata: AIKnowledgeBaseVersionMetadata;

  createdAt: string;

  updatedAt: string;

}