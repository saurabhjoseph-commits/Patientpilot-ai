/**
 * ============================================================
 * PatientPilot AI
 * Notification Policy
 * ============================================================
 */

import { Notification } from "./notification.types";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export class NotificationPolicy {
  static canQueue(
    notification: Notification,
  ): PolicyDecision {
    if (notification.status !== "pending") {
      return {
        allowed: false,
        reason:
          "Only pending notifications can be queued.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canSend(
    notification: Notification,
    now: Date = new Date(),
  ): PolicyDecision {
    if (
      notification.status !== "pending" &&
      notification.status !== "queued"
    ) {
      return {
        allowed: false,
        reason:
          "Only pending or queued notifications can be sent.",
      };
    }

    const scheduled =
      notification.delivery.scheduledFor;

    if (scheduled && scheduled > now) {
      return {
        allowed: false,
        reason:
          "Notification is scheduled for a future time.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canRetry(
    notification: Notification,
    maxAttempts = 3,
  ): PolicyDecision {
    if (notification.status !== "failed") {
      return {
        allowed: false,
        reason:
          "Only failed notifications can be retried.",
      };
    }

    if (
      notification.delivery.attempts >=
      maxAttempts
    ) {
      return {
        allowed: false,
        reason:
          "Maximum retry attempts reached.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canDeliver(
    notification: Notification,
  ): PolicyDecision {
    if (
      notification.status !== "sending" &&
      notification.status !== "sent"
    ) {
      return {
        allowed: false,
        reason:
          "Notification must be sending or sent before delivery.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canCancel(
    notification: Notification,
  ): PolicyDecision {
    switch (notification.status) {
      case "delivered":
      case "cancelled":
        return {
          allowed: false,
          reason:
            "Delivered or cancelled notifications cannot be cancelled.",
        };

      default:
        return {
          allowed: true,
        };
    }
  }

  static isScheduled(
    notification: Notification,
  ): boolean {
    return (
      notification.delivery.scheduledFor !==
      undefined
    );
  }

  static isDue(
    notification: Notification,
    now: Date = new Date(),
  ): boolean {
    const scheduled =
      notification.delivery.scheduledFor;

    if (!scheduled) {
      return true;
    }

    return scheduled <= now;
  }

  static isCompleted(
    notification: Notification,
  ): boolean {
    return (
      notification.status === "delivered"
    );
  }

  static hasFailed(
    notification: Notification,
  ): boolean {
    return (
      notification.status === "failed"
    );
  }

  static isTerminal(
    notification: Notification,
  ): boolean {
    return (
      notification.status === "delivered" ||
      notification.status === "cancelled"
    );
  }
}