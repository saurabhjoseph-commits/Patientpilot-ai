/**
 * ============================================================
 * PatientPilot AI
 * Notification Provider Contract
 * ============================================================
 */

import type {
  Notification,
  NotificationChannel,
  NotificationProvider as NotificationProviderName,
} from "../domain/notification.types";

export interface NotificationSendResult {
  success: boolean;

  providerMessageId?: string;

  status?:
    | "queued"
    | "sent"
    | "delivered";

  error?: string;

  rawResponse?: unknown;
}

export interface NotificationProviderCapabilities {
  provider: NotificationProviderName;

  channels: NotificationChannel[];

  supportsScheduling: boolean;

  supportsDeliveryStatus: boolean;

  supportsTemplates: boolean;

  supportsAttachments: boolean;

  supportsRetries: boolean;
}

export interface NotificationProvider {
  readonly name: NotificationProviderName;

  readonly capabilities: NotificationProviderCapabilities;

  send(
    notification: Notification,
  ): Promise<NotificationSendResult>;

  validate(
    notification: Notification,
  ): Promise<boolean>;

  healthCheck(): Promise<boolean>;
}