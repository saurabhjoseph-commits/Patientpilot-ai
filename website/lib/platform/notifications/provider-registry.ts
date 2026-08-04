/**
 * ============================================================
 * PatientPilot AI
 * Notification Provider Registry
 * ============================================================
 */

import type {
  NotificationProvider as NotificationProviderName,
} from "../domain/notification.types";

import type {
  NotificationProvider,
} from "./notification-provider";

export class NotificationProviderRegistry {
  private readonly providers = new Map<
    NotificationProviderName,
    NotificationProvider
  >();

  register(
    provider: NotificationProvider,
  ): void {
    this.providers.set(
      provider.name,
      provider,
    );
  }

  unregister(
    providerName: NotificationProviderName,
  ): void {
    this.providers.delete(providerName);
  }

  resolve(
    providerName: NotificationProviderName,
  ): NotificationProvider {
    const provider =
      this.providers.get(providerName);

    if (!provider) {
      throw new Error(
        `Notification provider '${providerName}' is not registered.`,
      );
    }

    return provider;
  }

  has(
    providerName: NotificationProviderName,
  ): boolean {
    return this.providers.has(providerName);
  }

  list(): NotificationProvider[] {
    return [
      ...this.providers.values(),
    ];
  }

  clear(): void {
    this.providers.clear();
  }
}

export const notificationProviderRegistry =
  new NotificationProviderRegistry();