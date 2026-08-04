/**
 * PP-002 Milestone C
 * Global Application Compliance Requirement Domain
 *
 * Represents a single compliance requirement,
 * clause, safeguard, or control objective
 * belonging to a compliance framework.
 */

export type ApplicationComplianceRequirementStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type ApplicationComplianceRequirementCategory =
  | "administrative"
  | "technical"
  | "physical"
  | "operational"
  | "organizational"
  | "legal"
  | "privacy"
  | "security"
  | "documentation"
  | "monitoring"
  | "custom";

export type ApplicationComplianceRequirementPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface ApplicationComplianceRequirementReference {

  frameworkId: string;

  section: string;

  subsection?: string;

  identifier: string;

  parentRequirementId?: string;

}

export interface ApplicationComplianceRequirementApplicability {

  countries: string[];

  industries: string[];

  tenantTypes: string[];

  environments: string[];

}

export interface ApplicationComplianceRequirementImplementation {

  required: boolean;

  recommendedControls: string[];

  relatedPolicyIds: string[];

  relatedRiskIds: string[];

}

export interface ApplicationComplianceRequirementDocumentation {

  summary: string;

  guidance?: string;

  examples: string[];

  externalReferences: string[];

}

export interface ApplicationComplianceRequirementMetadata {

  title: string;

  tags: string[];

}

export interface ApplicationComplianceRequirement {

  id: string;

  code: string;

  status: ApplicationComplianceRequirementStatus;

  category: ApplicationComplianceRequirementCategory;

  priority: ApplicationComplianceRequirementPriority;

  reference: ApplicationComplianceRequirementReference;

  applicability: ApplicationComplianceRequirementApplicability;

  implementation: ApplicationComplianceRequirementImplementation;

  documentation: ApplicationComplianceRequirementDocumentation;

  metadata: ApplicationComplianceRequirementMetadata;

  createdAt: string;

  updatedAt: string;

}