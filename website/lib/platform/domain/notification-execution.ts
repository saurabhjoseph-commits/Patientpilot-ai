import {
  notificationProviderRegistry,
} from "../notifications/provider-registry";

import {
  NotificationPolicy,
} from "./notification-policy";

import {
  validateNotification,
} from "./notification-validator";

import type {
  Notification,
  NotificationStatus,
} from "./notification.types";

export interface NotificationExecutionContext {
  executionId: string;

  startedAt: Date;

  provider?: string;

  correlationId?: string;
}

export interface NotificationExecutionResult {
  success: boolean;

  status: NotificationStatus;

  completedAt: Date;

  provider?: string;

  providerMessageId?: string;

  errorCode?: string;

  errorMessage?: string;

  metadata?: Record<
    string,
    unknown
  >;
}

export interface NotificationExecutor {
  execute(
    notification: Notification,
    context: NotificationExecutionContext,
  ): Promise<NotificationExecutionResult>;
}

export class DomainNotificationExecutionService
  implements NotificationExecutor
{
  async execute(
    notification: Notification,
    context: NotificationExecutionContext,
  ): Promise<NotificationExecutionResult> {

    // Validate notification
    const validation =
      validateNotification(notification);

    if (!validation.valid) {
      return {
        success: false,
        status: notification.status,
        completedAt: new Date(),
        errorCode: "VALIDATION_FAILED",
        errorMessage:
          validation.errors.join(", "),
      };
    }

    // Check business policy
    const decision =
      NotificationPolicy.canSend(
        notification,
      );

    if (!decision.allowed) {
      return {
        success: false,
        status: notification.status,
        completedAt: new Date(),
        errorCode: "POLICY_BLOCKED",
        errorMessage:
          decision.reason ??
          "Notification cannot be sent.",
      };
    }

    // Resolve provider
    const provider =
      notificationProviderRegistry.resolve(
        notification.delivery.provider,
      );

    // Optional provider validation
    const providerValid =
      await provider.validate(
        notification,
      );

    if (!providerValid) {
      return {
        success: false,
        status: notification.status,
        completedAt: new Date(),
        provider: provider.name,
        errorCode:
          "PROVIDER_VALIDATION_FAILED",
        errorMessage:
          "Notification is not supported by the selected provider.",
      };
    }

    // Send notification
    const result =
      await provider.send(
        notification,
      );

    return {
      success: result.success,

      status: result.success
        ? "sent"
        : "failed",

      completedAt: new Date(),

      provider: provider.name,

      providerMessageId:
        result.providerMessageId,

      errorCode: result.success
        ? undefined
        : "PROVIDER_SEND_FAILED",

      errorMessage: result.error,

      metadata: {
        executionId:
          context.executionId,

        correlationId:
          context.correlationId,

        rawResponse:
          result.rawResponse,
      },
    };
  }
}

export const notificationExecutionService =
  new DomainNotificationExecutionService();