/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a reusable AI agent definition.
 * An agent encapsulates a business role and
 * behavior independent of models, prompts,
 * tools, and runtime sessions.
 */

export type AIAgentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "deprecated"
  | "retired";

export type AIAgentCategory =
  | "assistant"
  | "receptionist"
  | "customer_service"
  | "sales"
  | "healthcare"
  | "finance"
  | "legal"
  | "hr"
  | "operations"
  | "analytics"
  | "automation"
  | "custom";

export interface AIAgentIdentity {

  displayName: string;

  shortName?: string;

  description?: string;

}

export interface AIAgentConfiguration {

  defaultLanguage: string;

  supportsMultiLanguage: boolean;

  humanHandoffEnabled: boolean;

  autonomousExecution: boolean;

}

export interface AIAgentAvailability {

  enabled: boolean;

  available24x7: boolean;

  supportedRegions: string[];

}

export interface AIAgentMetadata {

  icon?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface AIAgent {

  id: string;

  tenantId: string;

  code: string;

  version: number;

  status: AIAgentStatus;

  category: AIAgentCategory;

  identity: AIAgentIdentity;

  configuration: AIAgentConfiguration;

  availability: AIAgentAvailability;

  metadata: AIAgentMetadata;

  createdAt: string;

  updatedAt: string;

}