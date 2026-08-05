/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents an AI governance policy that
 * configures how AI agents may operate.
 */

export type AIPolicyStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

export type AIPolicyScope =
  | "global"
  | "tenant"
  | "organization"
  | "clinic"
  | "agent"
  | "environment";

export interface AIPolicyModelRules {

  allowedModelIds: string[];

  preferredModelId?: string;

  fallbackModelIds: string[];

  maximumInputTokens?: number;

  maximumOutputTokens?: number;

  maximumCostPerGeneration?: number;

}

export interface AIPolicyKnowledgeRules {

  allowedKnowledgeBaseIds: string[];

  maximumRetrievedChunks?: number;

  minimumSimilarityScore?: number;

}

export interface AIPolicyToolRules {

  allowedToolNames: string[];

  blockedToolNames: string[];

  requireAuthorization: boolean;

}

export interface AIPolicySafetyRules {

  requiredSafetyCheckTypes: string[];

  minimumSafetyScore?: number;

  allowHumanOverride: boolean;

}

export interface AIPolicyEscalationRules {

  requireHumanApproval: boolean;

  escalationRiskThreshold?: number;

  escalationConfidenceThreshold?: number;

}

export interface AIPolicyMetadata {

  description?: string;

  tags: string[];

}

export interface AIPolicy {

  id: string;

  tenantId?: string;

  name: string;

  status: AIPolicyStatus;

  scope: AIPolicyScope;

  modelRules: AIPolicyModelRules;

  knowledgeRules: AIPolicyKnowledgeRules;

  toolRules: AIPolicyToolRules;

  safetyRules: AIPolicySafetyRules;

  escalationRules: AIPolicyEscalationRules;

  metadata: AIPolicyMetadata;

  createdAt: string;

  updatedAt: string;

}