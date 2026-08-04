/**
 * ============================================================
 * PatientPilot AI
 * Notification Service
 * ============================================================
 */

import {
  Notification,
  NotificationStatus,
} from "./notification.types";

import {
  validateNotification,
  ValidationResult,
} from "./notification-validator";

import {
  NotificationPolicy,
  PolicyDecision,
} from "./notification-policy";

export class NotificationService {
  validate(
    notification: Notification,
  ): ValidationResult {
    return validateNotification(notification);
  }

  canQueue(
    notification: Notification,
  ): PolicyDecision {
    return NotificationPolicy.canQueue(notification);
  }

  canSend(
    notification: Notification,
    now?: Date,
  ): PolicyDecision {
    return NotificationPolicy.canSend(
      notification,
      now,
    );
  }

  canRetry(
    notification: Notification,
    maxAttempts = 3,
  ): PolicyDecision {
    return NotificationPolicy.canRetry(
      notification,
      maxAttempts,
    );
  }

  canDeliver(
    notification: Notification,
  ): PolicyDecision {
    return NotificationPolicy.canDeliver(
      notification,
    );
  }

  canCancel(
    notification: Notification,
  ): PolicyDecision {
    return NotificationPolicy.canCancel(
      notification,
    );
  }

  queue(
    notification: Notification,
    scheduledFor: Date,
  ): Notification {
    return {
      ...notification,
      status: "queued",
      delivery: {
        ...notification.delivery,
        scheduledFor,
      },
      updatedAt: new Date(),
    };
  }

  markSending(
    notification: Notification,
  ): Notification {
    return {
      ...notification,
      status: "sending",
      updatedAt: new Date(),
    };
  }

  markSent(
    notification: Notification,
    providerMessageId?: string,
  ): Notification {
    return {
      ...notification,
      status: "sent",
      delivery: {
        ...notification.delivery,
        providerMessageId,
        sentAt: new Date(),
        attempts:
          notification.delivery.attempts + 1,
        lastAttemptAt: new Date(),
      },
      updatedAt: new Date(),
    };
  }

  markDelivered(
    notification: Notification,
  ): Notification {
    return {
      ...notification,
      status: "delivered",
      delivery: {
        ...notification.delivery,
        deliveredAt: new Date(),
      },
      updatedAt: new Date(),
    };
  }

  markFailed(
    notification: Notification,
    reason: string,
  ): Notification {
    return {
      ...notification,
      status: "failed",
      delivery: {
        ...notification.delivery,
        attempts:
          notification.delivery.attempts + 1,
        lastAttemptAt: new Date(),
        failureReason: reason,
      },
      updatedAt: new Date(),
    };
  }

  retry(
    notification: Notification,
  ): Notification {
    return {
      ...notification,
      status: "queued",
      delivery: {
        ...notification.delivery,
        failureReason: undefined,
      },
      updatedAt: new Date(),
    };
  }

  cancel(
    notification: Notification,
  ): Notification {
    return {
      ...notification,
      status: "cancelled",
      updatedAt: new Date(),
    };
  }

  updateStatus(
    notification: Notification,
    status: NotificationStatus,
  ): Notification {
    return {
      ...notification,
      status,
      updatedAt: new Date(),
    };
  }

  updateProviderMessageId(
    notification: Notification,
    providerMessageId: string,
  ): Notification {
    return {
      ...notification,
      delivery: {
        ...notification.delivery,
        providerMessageId,
      },
      updatedAt: new Date(),
    };
  }

  isScheduled(
    notification: Notification,
  ): boolean {
    return NotificationPolicy.isScheduled(
      notification,
    );
  }

  isDue(
    notification: Notification,
    now?: Date,
  ): boolean {
    return NotificationPolicy.isDue(
      notification,
      now,
    );
  }

  isCompleted(
    notification: Notification,
  ): boolean {
    return NotificationPolicy.isCompleted(
      notification,
    );
  }

  hasFailed(
    notification: Notification,
  ): boolean {
    return NotificationPolicy.hasFailed(
      notification,
    );
  }

  isTerminal(
    notification: Notification,
  ): boolean {
    return NotificationPolicy.isTerminal(
      notification,
    );
  }
}

export const notificationService =
  new NotificationService();