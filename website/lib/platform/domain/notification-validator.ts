/**
 * ============================================================
 * PatientPilot AI
 * Notification Validator
 * ============================================================
 */

import {
  Notification,
  NotificationChannel,
  NotificationStatus,
} from "./notification.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateNotification(
  notification: Notification,
): ValidationResult {
  const errors: string[] = [];

  if (!notification.id.trim()) {
    errors.push("Notification ID is required.");
  }

  if (!notification.tenantId.trim()) {
    errors.push("Tenant ID is required.");
  }

  validateRecipient(notification, errors);
  validateContent(notification, errors);
  validateDelivery(notification, errors);
  validateStatus(notification.status, notification, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateRecipient(
  notification: Notification,
  errors: string[],
): void {
  const recipient = notification.recipient;

  switch (notification.channel) {
    case "email":
      if (!recipient.email?.trim()) {
        errors.push(
          "Email notifications require an email address.",
        );
      }
      break;

    case "sms":
    case "whatsapp":
    case "voice":
      if (!recipient.phone?.trim()) {
        errors.push(
          `${capitalize(notification.channel)} notifications require a phone number.`,
        );
      }
      break;

    case "push":
      if (!recipient.pushToken?.trim()) {
        errors.push(
          "Push notifications require a push token.",
        );
      }
      break;
  }
}

function validateContent(
  notification: Notification,
  errors: string[],
): void {
  const content = notification.content;

  if (!content.body.trim()) {
    errors.push(
      "Notification body is required.",
    );
  }

  if (
    notification.channel === "email" &&
    !content.subject?.trim()
  ) {
    errors.push(
      "Email notifications require a subject.",
    );
  }
}

function validateDelivery(
  notification: Notification,
  errors: string[],
): void {
  const delivery = notification.delivery;

  if (delivery.attempts < 0) {
    errors.push(
      "Delivery attempts cannot be negative.",
    );
  }

  if (
    delivery.deliveredAt &&
    !delivery.sentAt
  ) {
    errors.push(
      "Delivered notifications require a sent timestamp.",
    );
  }

  if (
    delivery.lastAttemptAt &&
    delivery.lastAttemptAt <
      notification.createdAt
  ) {
    errors.push(
      "Last attempt cannot be earlier than creation time.",
    );
  }

  if (
    delivery.scheduledFor &&
    delivery.deliveredAt &&
    delivery.deliveredAt <
      delivery.scheduledFor
  ) {
    errors.push(
      "Delivery cannot occur before the scheduled time.",
    );
  }
}

function validateStatus(
  status: NotificationStatus,
  notification: Notification,
  errors: string[],
): void {
  switch (status) {
    case "queued":
      if (!notification.delivery.scheduledFor) {
        errors.push(
          "Queued notifications require a scheduled time.",
        );
      }
      break;

    case "sent":
      if (!notification.delivery.sentAt) {
        errors.push(
          "Sent notifications require sentAt.",
        );
      }
      break;

    case "delivered":
      if (!notification.delivery.deliveredAt) {
        errors.push(
          "Delivered notifications require deliveredAt.",
        );
      }
      break;

    case "failed":
      if (
        !notification.delivery.failureReason?.trim()
      ) {
        errors.push(
          "Failed notifications require a failure reason.",
        );
      }
      break;
  }
}

function capitalize(
  value: NotificationChannel,
): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}