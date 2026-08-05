/**
 * PatientPilot AI
 * Infrastructure Layer
 * Service Container
 *
 * Lightweight dependency container for infrastructure
 * services and providers.
 */

export type ServiceFactory<T> = () => T;

export class ServiceContainer {
  private readonly services =
    new Map<string, unknown>();

  private readonly factories =
    new Map<string, ServiceFactory<unknown>>();

  register<T>(
    key: string,
    factory: ServiceFactory<T>,
  ): void {
    this.factories.set(key, factory);
  }

  resolve<T>(
    key: string,
  ): T {
    if (this.services.has(key)) {
      return this.services.get(key) as T;
    }

    const factory =
      this.factories.get(key);

    if (!factory) {
      throw new Error(
        `Service '${key}' is not registered.`,
      );
    }

    const instance = factory();

    this.services.set(
      key,
      instance,
    );

    return instance as T;
  }

  has(
    key: string,
  ): boolean {
    return this.factories.has(key);
  }

  unregister(
    key: string,
  ): boolean {
    this.services.delete(key);

    return this.factories.delete(key);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

/**
 * Shared infrastructure container.
 */
export const infrastructureContainer =
  new ServiceContainer();

export default infrastructureContainer;