/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a logical document within
 * an AI Knowledge Base.
 *
 * Document content is stored in
 * AIKnowledgeDocumentVersion.
 */

export type AIKnowledgeDocumentStatus =
  | "draft"
  | "active"
  | "archived"
  | "deprecated"
  | "retired";

export type AIKnowledgeDocumentCategory =
  | "faq"
  | "policy"
  | "procedure"
  | "treatment"
  | "insurance"
  | "pricing"
  | "training"
  | "documentation"
  | "legal"
  | "compliance"
  | "marketing"
  | "custom";

export interface AIKnowledgeDocumentIdentity {

  title: string;

  shortTitle?: string;

  description?: string;

}

export interface AIKnowledgeDocumentClassification {

  language: string;

  audience: string[];

  keywords: string[];

}

export interface AIKnowledgeDocumentConfiguration {

  supportsVersioning: boolean;

  searchable: boolean;

  embeddable: boolean;

  reusableAcrossKnowledgeBases: boolean;

}

export interface AIKnowledgeDocumentMetadata {

  ownerUserId?: string;

  sourceSystem?: string;

  externalReferenceId?: string;

  tags: string[];

}

export interface AIKnowledgeDocument {

  id: string;

  tenantId: string;

  knowledgeBaseId: string;

  code: string;

  version: number;

  status: AIKnowledgeDocumentStatus;

  category: AIKnowledgeDocumentCategory;

  identity: AIKnowledgeDocumentIdentity;

  classification: AIKnowledgeDocumentClassification;

  configuration: AIKnowledgeDocumentConfiguration;

  metadata: AIKnowledgeDocumentMetadata;

  createdAt: string;

  updatedAt: string;

}