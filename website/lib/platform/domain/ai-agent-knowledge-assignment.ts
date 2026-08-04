/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents the assignment of a versioned
 * Knowledge Base to an AI Agent Version.
 */

export type AIAgentKnowledgeAssignmentStatus =
  | "active"
  | "disabled"
  | "deprecated";

export type AIAgentKnowledgeRole =
  | "primary"
  | "secondary"
  | "reference"
  | "fallback"
  | "compliance"
  | "custom";

export interface AIAgentKnowledgeConfiguration {

  enabled: boolean;

  required: boolean;

  allowRuntimeOverride: boolean;

  includeSourceCitation: boolean;

}

export interface AIAgentKnowledgeRetrieval {

  priority: number;

  maximumDocuments: number;

  maximumChunks: number;

  minimumSimilarityScore?: number;

  runCondition?: string;

}

export interface AIAgentKnowledgeLifecycle {

  effectiveFrom?: string;

  effectiveUntil?: string;

}

export interface AIAgentKnowledgeMetadata {

  notes?: string;

  tags: string[];

}

export interface AIAgentKnowledgeAssignment {

  id: string;

  agentVersionId: string;

  knowledgeBaseVersionId: string;

  status: AIAgentKnowledgeAssignmentStatus;

  role: AIAgentKnowledgeRole;

  configuration: AIAgentKnowledgeConfiguration;

  retrieval: AIAgentKnowledgeRetrieval;

  lifecycle: AIAgentKnowledgeLifecycle;

  metadata: AIAgentKnowledgeMetadata;

  createdAt: string;

  updatedAt: string;

}