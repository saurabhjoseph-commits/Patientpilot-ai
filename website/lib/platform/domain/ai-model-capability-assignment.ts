/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents the assignment of a capability
 * to a specific AI model version.
 */

export type AIModelCapabilityAssignmentStatus =
  | "active"
  | "disabled"
  | "deprecated";

export type AIModelCapabilitySupportLevel =
  | "native"
  | "optimized"
  | "supported"
  | "limited"
  | "experimental";

export interface AIModelCapabilityAssignmentConfiguration {

  enabled: boolean;

  defaultEnabled: boolean;

  requiresConfiguration: boolean;

}

export interface AIModelCapabilityAssignmentConstraints {

  maxInputSize?: number;

  maxOutputSize?: number;

  supportedFormats: string[];

  limitations: string[];

}

export interface AIModelCapabilityAssignmentLifecycle {

  effectiveFrom?: string;

  effectiveUntil?: string;

}

export interface AIModelCapabilityAssignmentMetadata {

  notes?: string;

  tags: string[];

}

export interface AIModelCapabilityAssignment {

  id: string;

  modelVersionId: string;

  capabilityId: string;

  status: AIModelCapabilityAssignmentStatus;

  supportLevel: AIModelCapabilitySupportLevel;

  configuration: AIModelCapabilityAssignmentConfiguration;

  constraints: AIModelCapabilityAssignmentConstraints;

  lifecycle: AIModelCapabilityAssignmentLifecycle;

  metadata: AIModelCapabilityAssignmentMetadata;

  createdAt: string;

  updatedAt: string;

}