/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents an immutable retrieval chunk
 * generated from a Knowledge Document Version.
 */

export type AIKnowledgeChunkStatus =
  | "draft"
  | "indexed"
  | "active"
  | "deprecated"
  | "retired";

export interface AIKnowledgeChunkLocation {

  chunkIndex: number;

  startCharacter: number;

  endCharacter: number;

  startToken?: number;

  endToken?: number;

}

export interface AIKnowledgeChunkContent {

  title?: string;

  text: string;

  language: string;

}

export interface AIKnowledgeChunkClassification {

  keywords: string[];

  categories: string[];

}

export interface AIKnowledgeChunkConfiguration {

  searchable: boolean;

  embeddable: boolean;

  includeInRetrieval: boolean;

}

export interface AIKnowledgeChunkMetadata {

  sourceSection?: string;

  sourcePage?: number;

  tags: string[];

}

export interface AIKnowledgeChunk {

  id: string;

  documentVersionId: string;

  status: AIKnowledgeChunkStatus;

  location: AIKnowledgeChunkLocation;

  content: AIKnowledgeChunkContent;

  classification: AIKnowledgeChunkClassification;

  configuration: AIKnowledgeChunkConfiguration;

  metadata: AIKnowledgeChunkMetadata;

  createdAt: string;

  updatedAt: string;

}