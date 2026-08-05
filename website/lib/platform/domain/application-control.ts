/**
 * PP-002 Milestone C
 * Global Application Control Domain
 *
 * Represents a governance, security,
 * operational, or compliance control
 * implemented to reduce one or more risks.
 */

export type ApplicationControlStatus =
  | "planned"
  | "implementing"
  | "active"
  | "monitoring"
  | "retired"
  | "deprecated";

export type ApplicationControlCategory =
  | "preventive"
  | "detective"
  | "corrective"
  | "compensating"
  | "directive"
  | "administrative"
  | "technical"
  | "physical"
  | "operational"
  | "custom";

export type ApplicationControlAutomationLevel =
  | "manual"
  | "semi_automated"
  | "fully_automated";

export interface ApplicationControlScope {

  applicationIds: string[];

  environmentIds: string[];

  serviceIds: string[];

  tenantIds: string[];

}

export interface ApplicationControlImplementation {

  implementationSummary?: string;

  implementationDate?: string;

  ownerTeamId?: string;

  automationLevel: ApplicationControlAutomationLevel;

}

export interface ApplicationControlCoverage {

  mitigatedRiskIds: string[];

  complianceFrameworks: string[];

  policyIds: string[];

  standardReferences: string[];

}

export interface ApplicationControlMonitoring {

  monitoringEnabled: boolean;

  monitoringMethod?: string;

  monitoringFrequency?: string;

  lastVerifiedAt?: string;

  nextVerificationAt?: string;

}

export interface ApplicationControlMetadata {

  name: string;

  description?: string;

  documentationUrl?: string;

  runbookUrl?: string;

  tags: string[];

}

export interface ApplicationControl {

  id: string;

  code: string;

  status: ApplicationControlStatus;

  category: ApplicationControlCategory;

  scope: ApplicationControlScope;

  implementation: ApplicationControlImplementation;

  coverage: ApplicationControlCoverage;

  monitoring: ApplicationControlMonitoring;

  metadata: ApplicationControlMetadata;

  createdAt: string;

  updatedAt: string;

}