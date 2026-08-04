/**
 * PP-002 Milestone C
 * Global Application Compliance Framework Domain
 *
 * Defines an external or internal compliance
 * framework used for governance, audits,
 * security, privacy, and regulatory compliance.
 */

export type ApplicationComplianceFrameworkStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type ApplicationComplianceFrameworkCategory =
  | "security"
  | "privacy"
  | "healthcare"
  | "financial"
  | "government"
  | "quality"
  | "internal"
  | "industry"
  | "custom";

export interface ApplicationComplianceFrameworkAuthority {

  organization: string;

  website?: string;

  jurisdiction?: string;

  governingBody?: string;

}

export interface ApplicationComplianceFrameworkVersion {

  version: string;

  effectiveDate?: string;

  retiredDate?: string;

}

export interface ApplicationComplianceFrameworkScope {

  supportedCountries: string[];

  supportedIndustries: string[];

  applicableTenantTypes: string[];

}

export interface ApplicationComplianceFrameworkDocumentation {

  officialDocumentationUrl?: string;

  implementationGuideUrl?: string;

  referenceUrls: string[];

}

export interface ApplicationComplianceFrameworkMetadata {

  name: string;

  shortName: string;

  description?: string;

  tags: string[];

}

export interface ApplicationComplianceFramework {

  id: string;

  code: string;

  status: ApplicationComplianceFrameworkStatus;

  category: ApplicationComplianceFrameworkCategory;

  authority: ApplicationComplianceFrameworkAuthority;

  version: ApplicationComplianceFrameworkVersion;

  scope: ApplicationComplianceFrameworkScope;

  documentation: ApplicationComplianceFrameworkDocumentation;

  metadata: ApplicationComplianceFrameworkMetadata;

  createdAt: string;

  updatedAt: string;

}