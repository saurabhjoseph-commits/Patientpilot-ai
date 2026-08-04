/**
 * PP-002 Milestone C
 * Global Rule Domain
 *
 * Represents a reusable business rule
 * that can be evaluated throughout
 * the platform.
 */

export type RuleStatus =
  | "draft"
  | "active"
  | "inactive"
  | "deprecated";

export type RuleCategory =
  | "validation"
  | "automation"
  | "workflow"
  | "eligibility"
  | "notification"
  | "security"
  | "billing"
  | "ai"
  | "integration"
  | "custom";

export interface RuleVersion {

  major: number;

  minor: number;

  patch: number;

}

export interface RuleExpression {

  language: "expression";

  expression: string;

}

export interface RuleExecution {

  enabled: boolean;

  stopOnFailure: boolean;

  priority: number;

}

export interface RuleMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Rule {

  id: string;

  tenantId?: string;

  clinicId?: string;

  status: RuleStatus;

  category: RuleCategory;

  name: string;

  displayName: string;

  version: RuleVersion;

  expression: RuleExpression;

  execution: RuleExecution;

  metadata: RuleMetadata;

  createdAt: string;

  updatedAt: string;

}