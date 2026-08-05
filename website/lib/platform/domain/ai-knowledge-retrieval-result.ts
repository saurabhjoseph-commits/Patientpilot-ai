/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a single knowledge chunk returned
 * by an AI Knowledge Retrieval operation.
 */

export type AIKnowledgeRetrievalResultStatus =
  | "retrieved"
  | "selected"
  | "excluded"
  | "used"
  | "discarded";

export interface AIKnowledgeRetrievalResultRanking {

  retrievalRank: number;

  rerankScore?: number;

  similarityScore: number;

}

export interface AIKnowledgeRetrievalResultSelection {

  selectedForPrompt: boolean;

  includedInContext: boolean;

  citationEnabled: boolean;

  selectionReason?: string;

}

export interface AIKnowledgeRetrievalResultChunk {

  knowledgeChunkId: string;

  documentVersionId: string;

  knowledgeBaseVersionId: string;

}

export interface AIKnowledgeRetrievalResultPerformance {

  retrievalLatencyMilliseconds?: number;

  rerankingLatencyMilliseconds?: number;

}

export interface AIKnowledgeRetrievalResultMetadata {

  notes?: string;

  tags: string[];

}

export interface AIKnowledgeRetrievalResult {

  id: string;

  retrievalId: string;

  status: AIKnowledgeRetrievalResultStatus;

  chunk: AIKnowledgeRetrievalResultChunk;

  ranking: AIKnowledgeRetrievalResultRanking;

  selection: AIKnowledgeRetrievalResultSelection;

  performance: AIKnowledgeRetrievalResultPerformance;

  metadata: AIKnowledgeRetrievalResultMetadata;

  createdAt: string;

  updatedAt: string;

}