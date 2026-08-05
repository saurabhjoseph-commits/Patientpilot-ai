/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents the assignment of a reusable AI
 * capability to a specific AI agent version.
 */

export type AIAgentCapabilityAssignmentStatus =
  | "active"
  | "disabled"
  | "deprecated";

export type AIAgentCapabilityAccess =
  | "allowed"
  | "restricted"
  | "conditional";

export interface AIAgentCapabilityConfiguration {

  enabled: boolean;

  defaultEnabled: boolean;

  requiresApproval: boolean;

  allowOverride: boolean;

}

export interface AIAgentCapabilityConstraints {

  maxInvocationsPerSession?: number;

  maxInvocationsPerDay?: number;

  supportedContexts: string[];

  restrictedContexts: string[];

}

export interface AIAgentCapabilityLifecycle {

  effectiveFrom?: string;

  effectiveUntil?: string;

}

export interface AIAgentCapabilityMetadata {

  notes?: string;

  tags: string[];

}

export interface AIAgentCapabilityAssignment {

  id: string;

  agentVersionId: string;

  capabilityId: string;

  status: AIAgentCapabilityAssignmentStatus;

  access: AIAgentCapabilityAccess;

  configuration: AIAgentCapabilityConfiguration;

  constraints: AIAgentCapabilityConstraints;

  lifecycle: AIAgentCapabilityLifecycle;

  metadata: AIAgentCapabilityMetadata;

  createdAt: string;

  updatedAt: string;

}