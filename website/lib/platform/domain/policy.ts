/**
 * PP-002 Milestone C
 * Global Policy Domain
 *
 * Represents a reusable business policy
 * composed of one or more business rules.
 */

export type PolicyStatus =
  | "draft"
  | "active"
  | "inactive"
  | "deprecated";

export type PolicyCategory =
  | "clinical"
  | "patient"
  | "appointment"
  | "billing"
  | "security"
  | "compliance"
  | "automation"
  | "workflow"
  | "ai"
  | "integration"
  | "custom";

export type PolicyEvaluationMode =
  | "all"
  | "any"
  | "priority";

export interface PolicyVersion {

  major: number;

  minor: number;

  patch: number;

}

export interface PolicyRuleReference {

  ruleId: string;

  priority: number;

  required: boolean;

}

export interface PolicyConfiguration {

  evaluationMode: PolicyEvaluationMode;

  stopOnFailure: boolean;

}

export interface PolicyMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Policy {

  id: string;

  tenantId?: string;

  clinicId?: string;

  status: PolicyStatus;

  category: PolicyCategory;

  name: string;

  displayName: string;

  version: PolicyVersion;

  rules: PolicyRuleReference[];

  configuration: PolicyConfiguration;

  metadata: PolicyMetadata;

  createdAt: string;

  updatedAt: string;

}