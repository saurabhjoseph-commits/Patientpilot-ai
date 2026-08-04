/**
 * PP-002 Milestone C
 * Global API Key Domain
 *
 * Represents machine-to-machine authentication
 * for platform integrations.
 */

export type ApiKeyStatus =
  | "active"
  | "inactive"
  | "expired"
  | "revoked";

export type ApiKeyType =
  | "platform"
  | "tenant"
  | "clinic"
  | "integration"
  | "service";

export interface ApiKeyScope {

  permissions: string[];

}

export interface ApiKeyMetadata {

  description?: string;

  createdBy?: string;

  lastUsedAt?: string;

  lastUsedIp?: string;

}

export interface ApiKey {

  id: string;

  tenantId?: string;

  clinicId?: string;

  status: ApiKeyStatus;

  type: ApiKeyType;

  name: string;

  keyPrefix: string;

  keyHash: string;

  scope: ApiKeyScope;

  expiresAt?: string;

  metadata: ApiKeyMetadata;

  createdAt: string;

  updatedAt: string;

}