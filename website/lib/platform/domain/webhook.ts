/**
 * PP-002 Milestone C
 * Global Webhook Domain
 *
 * Represents an outbound webhook subscription
 * for platform events.
 */

export type WebhookStatus =
  | "active"
  | "inactive"
  | "disabled"
  | "error";

export type WebhookAuthentication =
  | "none"
  | "api_key"
  | "bearer"
  | "basic"
  | "signature";

export interface WebhookSecurity {

  authentication: WebhookAuthentication;

  secret?: string;

  headers: Record<string, string>;

}

export interface WebhookRetryPolicy {

  enabled: boolean;

  maxAttempts: number;

  retryIntervalSeconds: number;

}

export interface WebhookMetadata {

  description?: string;

  createdBy?: string;

  lastDeliveredAt?: string;

  lastFailureAt?: string;

  failureReason?: string;

}

export interface Webhook {

  id: string;

  tenantId: string;

  clinicId?: string;

  status: WebhookStatus;

  name: string;

  endpoint: string;

  events: string[];

  security: WebhookSecurity;

  retryPolicy: WebhookRetryPolicy;

  metadata: WebhookMetadata;

  createdAt: string;

  updatedAt: string;

}