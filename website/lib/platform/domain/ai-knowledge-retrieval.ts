/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a single Retrieval-Augmented
 * Generation (RAG) knowledge retrieval
 * executed during an AI Generation.
 */

export type AIKnowledgeRetrievalStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type AIKnowledgeRetrievalStrategy =
  | "vector"
  | "keyword"
  | "hybrid"
  | "metadata_filter"
  | "semantic"
  | "custom";

export interface AIKnowledgeRetrievalQuery {

  text: string;

  embeddingId?: string;

  language?: string;

}

export interface AIKnowledgeRetrievalSearch {

  knowledgeBaseVersionId: string;

  strategy: AIKnowledgeRetrievalStrategy;

  maximumResults: number;

  minimumSimilarityScore?: number;

  filters?: Record<string, unknown>;

}

export interface AIKnowledgeRetrievalPerformance {

  startedAt: string;

  completedAt?: string;

  latencyMilliseconds?: number;

}

export interface AIKnowledgeRetrievalStatistics {

  chunksScanned?: number;

  chunksMatched?: number;

  chunksReturned?: number;

}

export interface AIKnowledgeRetrievalMetadata {

  notes?: string;

  tags: string[];

}

export interface AIKnowledgeRetrieval {

  id: string;

  sessionId: string;

  messageId: string;

  generationId: string;

  status: AIKnowledgeRetrievalStatus;

  query: AIKnowledgeRetrievalQuery;

  search: AIKnowledgeRetrievalSearch;

  performance: AIKnowledgeRetrievalPerformance;

  statistics: AIKnowledgeRetrievalStatistics;

  metadata: AIKnowledgeRetrievalMetadata;

  createdAt: string;

  updatedAt: string;

}