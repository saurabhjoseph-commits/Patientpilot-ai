/**
 * ============================================================
 * PatientPilot AI
 * Service Registry
 * ============================================================
 *
 * Infrastructure composition root.
 *
 * Registers and resolves infrastructure services used by the
 * Application Layer.
 *
 * This is the single place where interfaces are mapped to
 * concrete implementations.
 */

export type ServiceFactory<T> = () => T;

export class ServiceRegistry {
  private readonly services = new Map<string, unknown>();

  /**
   * Registers a singleton instance.
   */
  registerSingleton<T>(
    key: string,
    instance: T,
  ): void {
    if (this.services.has(key)) {
      throw new Error(
        `Service '${key}' is already registered.`,
      );
    }

    this.services.set(key, instance);
  }

  /**
   * Registers a service using a factory.
   *
   * The factory is executed immediately so every service
   * behaves as a singleton.
   */
  registerFactory<T>(
    key: string,
    factory: ServiceFactory<T>,
  ): void {
    this.registerSingleton(key, factory());
  }

  /**
   * Resolves a registered service.
   */
  resolve<T>(key: string): T {
    const service = this.services.get(key);

    if (!service) {
      throw new Error(
        `Service '${key}' has not been registered.`,
      );
    }

    return service as T;
  }

  /**
   * Determines whether a service exists.
   */
  has(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Removes all registrations.
   *
   * Primarily useful for tests.
   */
  clear(): void {
    this.services.clear();
  }
}

/**
 * Global registry instance.
 *
 * Used during application startup.
 */
export const serviceRegistry =
  new ServiceRegistry();