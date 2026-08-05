/**
 * ============================================================
 * PatientPilot AI
 * Notification Aggregate Root
 * ============================================================
 */

import {
  Notification,
  NotificationChannel,
  NotificationContent,
  NotificationDelivery,
  NotificationMetadata,
  NotificationPriority,
  NotificationProvider,
  NotificationRecipient,
  NotificationStatus,
} from "./notification.types";

export interface CreateNotificationParams {
  id: string;
  tenantId: string;
  channel: NotificationChannel;
  priority?: NotificationPriority;
  recipient: NotificationRecipient;
  content: NotificationContent;
  provider: NotificationProvider;
  metadata?: Partial<NotificationMetadata>;
  scheduledFor?: Date;
}

export class NotificationAggregate {
  static create(
    params: CreateNotificationParams,
  ): Notification {
    const now = new Date();

    return {
      id: params.id,

      tenantId: params.tenantId,

      channel: params.channel,

      status: params.scheduledFor
        ? "queued"
        : "pending",

      priority: params.priority ?? "normal",

      recipient: {
        ...params.recipient,
      },

      content: {
        ...params.content,
      },

      delivery: defaultDelivery(
        params.provider,
        params.scheduledFor,
      ),

      metadata: {
        ...params.metadata,
      },

      createdAt: now,

      updatedAt: now,
    };
  }

  static updateStatus(
    notification: Notification,
    status: NotificationStatus,
  ): Notification {
    return {
      ...notification,
      status,
      updatedAt: new Date(),
    };
  }

  static updateRecipient(
    notification: Notification,
    recipient: Partial<NotificationRecipient>,
  ): Notification {
    return {
      ...notification,
      recipient: {
        ...notification.recipient,
        ...recipient,
      },
      updatedAt: new Date(),
    };
  }

  static updateContent(
    notification: Notification,
    content: Partial<NotificationContent>,
  ): Notification {
    return {
      ...notification,
      content: {
        ...notification.content,
        ...content,
      },
      updatedAt: new Date(),
    };
  }

  static updateDelivery(
    notification: Notification,
    delivery: Partial<NotificationDelivery>,
  ): Notification {
    return {
      ...notification,
      delivery: {
        ...notification.delivery,
        ...delivery,
      },
      updatedAt: new Date(),
    };
  }

  static updateMetadata(
    notification: Notification,
    metadata: Partial<NotificationMetadata>,
  ): Notification {
    return {
      ...notification,
      metadata: {
        ...notification.metadata,
        ...metadata,
      },
      updatedAt: new Date(),
    };
  }
}

function defaultDelivery(
  provider: NotificationProvider,
  scheduledFor?: Date,
): NotificationDelivery {
  return {
    provider,

    providerMessageId: undefined,

    attempts: 0,

    lastAttemptAt: undefined,

    scheduledFor,

    sentAt: undefined,

    deliveredAt: undefined,

    failureReason: undefined,
  };
}