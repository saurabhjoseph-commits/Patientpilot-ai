/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents the vector embedding generated
 * from an AI Memory Entry using a specific
 * AI Model Version.
 */

export type AIMemoryEmbeddingStatus =
  | "pending"
  | "generating"
  | "active"
  | "deprecated"
  | "failed"
  | "retired";

export type AIMemoryEmbeddingProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "cohere"
  | "azure_openai"
  | "huggingface"
  | "self_hosted"
  | "custom";

export interface AIMemoryEmbeddingVector {

  dimensions: number;

  values?: number[];

  checksum?: string;

}

export interface AIMemoryEmbeddingIndex {

  provider: AIMemoryEmbeddingProvider;

  indexName: string;

  namespace?: string;

  externalVectorId?: string;

}

export interface AIMemoryEmbeddingGeneration {

  generatedAt?: string;

  durationMilliseconds?: number;

  tokenCount?: number;

  cost?: number;

}

export interface AIMemoryEmbeddingMetadata {

  similarityMetric:
    | "cosine"
    | "dot_product"
    | "euclidean";

  notes?: string;

  tags: string[];

}

export interface AIMemoryEmbedding {

  id: string;

  memoryEntryId: string;

  modelVersionId: string;

  status: AIMemoryEmbeddingStatus;

  vector: AIMemoryEmbeddingVector;

  index: AIMemoryEmbeddingIndex;

  generation: AIMemoryEmbeddingGeneration;

  metadata: AIMemoryEmbeddingMetadata;

  createdAt: string;

  updatedAt: string;

}