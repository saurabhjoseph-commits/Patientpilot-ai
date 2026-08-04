/**
 * PP-002 Milestone C
 * Global Application Notification Delivery Domain
 *
 * Runtime notification delivery generated
 * from an application alert.
 */

export type ApplicationNotificationDeliveryStatus =
  | "queued"
  | "sending"
  | "delivered"
  | "failed"
  | "cancelled"
  | "expired";

export interface ApplicationNotificationDeliveryRequest {

  alertId: string;

  notificationChannelId: string;

  initiatedBy?: string;

  priority:
    | "critical"
    | "high"
    | "normal"
    | "low";

}

export interface ApplicationNotificationDeliveryPayload {

  subject?: string;

  title?: string;

  message: string;

  data?: Record<string, unknown>;

}

export interface ApplicationNotificationDeliveryAttempt {

  currentAttempt: number;

  maxAttempts: number;

  retryCount: number;

  nextRetryAt?: string;

}

export interface ApplicationNotificationDeliveryResponse {

  providerMessageId?: string;

  providerStatus?: string;

  httpStatusCode?: number;

  responseTimeMs?: number;

}

export interface ApplicationNotificationDeliveryResult {

  success: boolean;

  errorCode?: string;

  errorMessage?: string;

}

export interface ApplicationNotificationDeliveryMetadata {

  traceId?: string;

  logsUrl?: string;

  tags: string[];

}

export interface ApplicationNotificationDelivery {

  id: string;

  applicationId: string;

  status: ApplicationNotificationDeliveryStatus;

  request: ApplicationNotificationDeliveryRequest;

  payload: ApplicationNotificationDeliveryPayload;

  attempt: ApplicationNotificationDeliveryAttempt;

  response: ApplicationNotificationDeliveryResponse;

  result: ApplicationNotificationDeliveryResult;

  metadata: ApplicationNotificationDeliveryMetadata;

  queuedAt?: string;

  sentAt?: string;

  completedAt?: string;

  createdAt: string;

  updatedAt: string;

}