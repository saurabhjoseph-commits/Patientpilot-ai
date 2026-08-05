/**
 * PP-002 Milestone A
 * Global Integration Domain
 *
 * Represents an external system connected
 * to PatientPilot AI.
 */

export type IntegrationStatus =
  | "connected"
  | "disconnected"
  | "pending"
  | "error"
  | "disabled";

export type IntegrationCategory =
  | "practice_management"
  | "telephony"
  | "calendar"
  | "payment"
  | "email"
  | "messaging"
  | "ai"
  | "analytics"
  | "storage"
  | "identity"
  | "other";

export type AuthenticationType =
  | "api_key"
  | "oauth2"
  | "basic"
  | "bearer"
  | "none";

export interface IntegrationCredentials {

  authentication: AuthenticationType;

  configuration: Record<string, string>;

}

export interface IntegrationCapabilities {

  inboundSync: boolean;

  outboundSync: boolean;

  realtime: boolean;

  webhooks: boolean;

}

export interface IntegrationMetadata {

  vendor: string;

  version?: string;

  endpoint?: string;

  externalAccountId?: string;

}

export interface Integration {

  id: string;

  tenantId: string;

  clinicId: string;

  status: IntegrationStatus;

  category: IntegrationCategory;

  name: string;

  displayName: string;

  credentials: IntegrationCredentials;

  capabilities: IntegrationCapabilities;

  metadata: IntegrationMetadata;

  lastConnectedAt?: string;

  lastSyncAt?: string;

  createdAt: string;

  updatedAt: string;

}