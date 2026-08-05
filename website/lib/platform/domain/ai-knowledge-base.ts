/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a reusable AI knowledge repository.
 * Actual knowledge content is stored in
 * AIKnowledgeBaseVersion.
 */

export type AIKnowledgeBaseStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type AIKnowledgeBaseCategory =
  | "clinic"
  | "medical"
  | "treatment"
  | "faq"
  | "policy"
  | "insurance"
  | "pricing"
  | "compliance"
  | "product"
  | "documentation"
  | "training"
  | "custom";

export interface AIKnowledgeBaseIdentity {

  displayName: string;

  shortName?: string;

  description?: string;

}

export interface AIKnowledgeBaseConfiguration {

  supportsVersioning: boolean;

  supportsLocalization: boolean;

  supportsSemanticSearch: boolean;

  reusableAcrossAgents: boolean;

}

export interface AIKnowledgeBaseMetadata {

  documentationUrl?: string;

  ownerUserId?: string;

  tags: string[];

}

export interface AIKnowledgeBase {

  id: string;

  tenantId: string;

  code: string;

  version: number;

  status: AIKnowledgeBaseStatus;

  category: AIKnowledgeBaseCategory;

  identity: AIKnowledgeBaseIdentity;

  configuration: AIKnowledgeBaseConfiguration;

  metadata: AIKnowledgeBaseMetadata;

  createdAt: string;

  updatedAt: string;

}