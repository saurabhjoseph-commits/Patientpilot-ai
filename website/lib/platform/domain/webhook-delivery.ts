/**
 * PP-002 Milestone C
 * Global Webhook Delivery Domain
 *
 * Represents a single delivery attempt
 * for a webhook event.
 */

export type WebhookDeliveryStatus =
  | "pending"
  | "queued"
  | "sending"
  | "delivered"
  | "failed"
  | "cancelled";

export interface WebhookRequest {

  event: string;

  payloadVersion: string;

  payloadSizeBytes: number;

}

export interface WebhookResponse {

  statusCode?: number;

  responseTimeMs?: number;

  responseBody?: string;

}

export interface WebhookRetry {

  attempt: number;

  maxAttempts: number;

  nextRetryAt?: string;

}

export interface WebhookDeliveryMetadata {

  requestId?: string;

  correlationId?: string;

  errorMessage?: string;

}

export interface WebhookDelivery {

  id: string;

  tenantId: string;

  clinicId?: string;

  webhookId: string;

  status: WebhookDeliveryStatus;

  request: WebhookRequest;

  response: WebhookResponse;

  retry: WebhookRetry;

  metadata: WebhookDeliveryMetadata;

  deliveredAt?: string;

  createdAt: string;

  updatedAt: string;

}