/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents the vector embedding generated
 * from a Knowledge Chunk using a specific
 * AI Model Version.
 */

export type AIEmbeddingStatus =
  | "pending"
  | "generating"
  | "active"
  | "deprecated"
  | "failed"
  | "retired";

export type AIEmbeddingProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "cohere"
  | "azure_openai"
  | "huggingface"
  | "self_hosted"
  | "custom";

export interface AIEmbeddingVector {

  dimensions: number;

  values?: number[];

  checksum?: string;

}

export interface AIEmbeddingIndex {

  provider: AIEmbeddingProvider;

  indexName: string;

  namespace?: string;

  externalVectorId?: string;

}

export interface AIEmbeddingGeneration {

  generatedAt?: string;

  durationMilliseconds?: number;

  tokenCount?: number;

  cost?: number;

}

export interface AIEmbeddingMetadata {

  similarityMetric: "cosine" | "dot_product" | "euclidean";

  notes?: string;

  tags: string[];

}

export interface AIEmbedding {

  id: string;

  chunkId: string;

  modelVersionId: string;

  status: AIEmbeddingStatus;

  vector: AIEmbeddingVector;

  index: AIEmbeddingIndex;

  generation: AIEmbeddingGeneration;

  metadata: AIEmbeddingMetadata;

  createdAt: string;

  updatedAt: string;

}