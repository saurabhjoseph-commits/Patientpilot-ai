/**
 * PatientPilot AI
 * Application Layer
 * Notification Service
 *
 * Coordinates outbound notifications across multiple
 * communication channels.
 */

import {
  IntegrationManager,
} from "../platform/contracts/integration-manager";

import {
  EventBus,
} from "../platform/contracts/event-bus";

import {
  integrationManager,
} from "../platform/runtime/integration-manager";

import {
  eventBus,
} from "../platform/runtime/event-bus";

export type NotificationChannel =
  | "sms"
  | "email"
  | "voice"
  | "push"
  | "whatsapp";

export interface NotificationRequest {
  readonly clinicId: string;
  readonly patientId?: string;
  readonly channel: NotificationChannel;
  readonly recipient: string;
  readonly subject?: string;
  readonly message: string;
}

export interface NotificationResult {
  readonly success: boolean;
  readonly notificationId?: string;
  readonly message?: string;
}

export interface NotificationService {
  send(
    request: NotificationRequest,
  ): Promise<NotificationResult>;

  schedule(
    request: NotificationRequest,
    scheduledAt: Date,
  ): Promise<NotificationResult>;
}

/**
 * Default Notification Service.
 */
export class DefaultNotificationService
  implements NotificationService
{
  constructor(
    private readonly integrations: IntegrationManager =
      integrationManager,
    private readonly events: EventBus =
      eventBus,
  ) {}

  async send(
    request: NotificationRequest,
  ): Promise<NotificationResult> {
    // Future milestones:
    // - Resolve provider
    // - Execute integration
    // - Publish NotificationSent event

    void this.integrations;
    void this.events;
    void request;

    return {
      success: true,
      notificationId: crypto.randomUUID(),
      message: "Notification sent.",
    };
  }

  async schedule(
    request: NotificationRequest,
    scheduledAt: Date,
  ): Promise<NotificationResult> {
    void request;
    void scheduledAt;

    return {
      success: true,
      notificationId: crypto.randomUUID(),
      message: "Notification scheduled.",
    };
  }
}

/**
 * Creates a Notification Service.
 */
export function createNotificationService(): NotificationService {
  return new DefaultNotificationService();
}

/**
 * Shared Notification Service.
 */
export const notificationService =
  createNotificationService();

/**
 * Default Notification Service.
 */
export default notificationService;