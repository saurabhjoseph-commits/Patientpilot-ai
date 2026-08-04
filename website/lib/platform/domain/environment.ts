/**
 * PP-002 Milestone C
 * Global Environment Domain
 *
 * Represents logical execution
 * environments across the
 * PatientPilot AI platform.
 */

export type EnvironmentStatus =
  | "provisioning"
  | "active"
  | "maintenance"
  | "inactive"
  | "retired";

export type EnvironmentType =
  | "development"
  | "testing"
  | "qa"
  | "staging"
  | "production"
  | "demo"
  | "sandbox"
  | "training";

export interface EnvironmentIdentity {

  name: string;

  description?: string;

}

export interface EnvironmentInfrastructure {

  region?: string;

  cloudProvider?: "aws" | "azure" | "gcp" | "local" | "hybrid";

  cluster?: string;

}

export interface EnvironmentCapabilities {

  publicAccess: boolean;

  allowTestData: boolean;

  allowDebugMode: boolean;

  allowMockServices: boolean;

}

export interface EnvironmentCompliance {

  backupEnabled: boolean;

  auditEnabled: boolean;

  monitoringEnabled: boolean;

}

export interface EnvironmentMetadata {

  tags: string[];

}

export interface Environment {

  id: string;

  code: string;

  status: EnvironmentStatus;

  type: EnvironmentType;

  identity: EnvironmentIdentity;

  infrastructure: EnvironmentInfrastructure;

  capabilities: EnvironmentCapabilities;

  compliance: EnvironmentCompliance;

  metadata: EnvironmentMetadata;

  createdAt: string;

  updatedAt: string;

}