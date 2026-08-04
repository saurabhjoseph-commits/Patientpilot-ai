/**
 * PP-002 Milestone C
 * Global Application Compliance Maturity Model Domain
 *
 * Defines a reusable compliance maturity model that
 * organizations can use to measure governance maturity.
 */

export type ApplicationComplianceMaturityModelStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type ApplicationComplianceMaturityModelCategory =
  | "security"
  | "privacy"
  | "healthcare"
  | "governance"
  | "risk"
  | "quality"
  | "enterprise"
  | "custom";

export interface ApplicationComplianceMaturityLevel {

  level: number;

  code: string;

  name: string;

  description: string;

  objectives: string[];

  expectedCapabilities: string[];

}

export interface ApplicationComplianceMaturityDimension {

  id: string;

  code: string;

  name: string;

  description: string;

  weight?: number;

}

export interface ApplicationComplianceMaturityScoring {

  minimumScore: number;

  maximumScore: number;

  passingScore?: number;

  scoringMethod:
    | "numeric"
    | "percentage"
    | "weighted"
    | "capability"
    | "custom";

}

export interface ApplicationComplianceMaturityModelMetadata {

  title: string;

  description?: string;

  versionLabel?: string;

  authority?: string;

  tags: string[];

}

export interface ApplicationComplianceMaturityModel {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceMaturityModelStatus;

  category: ApplicationComplianceMaturityModelCategory;

  levels: ApplicationComplianceMaturityLevel[];

  dimensions: ApplicationComplianceMaturityDimension[];

  scoring: ApplicationComplianceMaturityScoring;

  metadata: ApplicationComplianceMaturityModelMetadata;

  createdAt: string;

  updatedAt: string;

}