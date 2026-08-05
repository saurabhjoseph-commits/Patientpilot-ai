/**
 * PP-002 Milestone C
 * Global Domain Name Domain
 *
 * Represents internet domains
 * managed by the platform.
 */

export type DomainNameStatus =
  | "pending"
  | "verifying"
  | "verified"
  | "active"
  | "inactive"
  | "expired";

export type DomainNameType =
  | "primary"
  | "secondary"
  | "redirect"
  | "landing_page"
  | "patient_portal"
  | "api"
  | "admin"
  | "custom";

export interface DomainOwnership {

  organizationId?: string;

  brandId?: string;

  tenantId?: string;

}

export interface DomainConfiguration {

  hostname: string;

  isPrimary: boolean;

  redirectTo?: string;

}

export interface DomainSecurity {

  sslEnabled: boolean;

  sslProvider?: string;

  certificateExpiresAt?: string;

  dnsVerified: boolean;

  verificationToken?: string;

}

export interface DomainRouting {

  environment: "production" | "staging" | "development";

  basePath?: string;

}

export interface DomainMetadata {

  description?: string;

  tags: string[];

}

export interface DomainName {

  id: string;

  code: string;

  status: DomainNameStatus;

  type: DomainNameType;

  ownership: DomainOwnership;

  configuration: DomainConfiguration;

  security: DomainSecurity;

  routing: DomainRouting;

  metadata: DomainMetadata;

  createdAt: string;

  updatedAt: string;

}