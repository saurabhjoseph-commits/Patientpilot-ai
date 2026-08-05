/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a versioned content snapshot
 * of an AI Knowledge Document.
 */

export type AIKnowledgeDocumentVersionStatus =
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "deprecated"
  | "retired";

export type AIKnowledgeDocumentReleaseChannel =
  | "development"
  | "staging"
  | "production"
  | "preview";

export type AIKnowledgeDocumentFormat =
  | "markdown"
  | "html"
  | "text"
  | "pdf"
  | "json"
  | "xml"
  | "custom";

export interface AIKnowledgeDocumentContent {

  title: string;

  summary?: string;

  body: string;

  format: AIKnowledgeDocumentFormat;

}

export interface AIKnowledgeDocumentValidation {

  approved: boolean;

  approvedByUserId?: string;

  approvedAt?: string;

  validationNotes?: string;

}

export interface AIKnowledgeDocumentStatistics {

  wordCount: number;

  estimatedReadingTimeMinutes?: number;

}

export interface AIKnowledgeDocumentLifecycle {

  publishedAt?: string;

  effectiveFrom?: string;

  effectiveUntil?: string;

  deprecatedAt?: string;

  retiredAt?: string;

}

export interface AIKnowledgeDocumentVersionMetadata {

  displayName: string;

  description?: string;

  changelog?: string;

  tags: string[];

}

export interface AIKnowledgeDocumentVersion {

  id: string;

  code: string;

  version: number;

  documentId: string;

  status: AIKnowledgeDocumentVersionStatus;

  releaseChannel: AIKnowledgeDocumentReleaseChannel;

  content: AIKnowledgeDocumentContent;

  validation: AIKnowledgeDocumentValidation;

  statistics: AIKnowledgeDocumentStatistics;

  lifecycle: AIKnowledgeDocumentLifecycle;

  metadata: AIKnowledgeDocumentVersionMetadata;

  createdAt: string;

  updatedAt: string;

}