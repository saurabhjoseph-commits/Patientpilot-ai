/**
 * PP-002 Milestone C
 * Global Domain Alias Domain
 *
 * Represents alternate hostnames
 * that resolve to a primary
 * platform domain.
 */

export type DomainAliasStatus =
  | "pending"
  | "verifying"
  | "verified"
  | "active"
  | "inactive";

export type DomainAliasType =
  | "www"
  | "country"
  | "regional"
  | "vanity"
  | "legacy"
  | "custom";

export interface DomainAliasConfiguration {

  hostname: string;

  canonical: boolean;

}

export interface DomainAliasSecurity {

  dnsVerified: boolean;

  sslEnabled: boolean;

  verificationToken?: string;

}

export interface DomainAliasValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface DomainAliasMetadata {

  description?: string;

  tags: string[];

}

export interface DomainAlias {

  id: string;

  domainNameId: string;

  status: DomainAliasStatus;

  type: DomainAliasType;

  configuration: DomainAliasConfiguration;

  security: DomainAliasSecurity;

  validity: DomainAliasValidity;

  metadata: DomainAliasMetadata;

  createdAt: string;

  updatedAt: string;

}