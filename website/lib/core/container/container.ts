/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Dependency Injection Container
 * ============================================================
 */

import { ConfigurationError } from "../errors/ConfigurationError";

import {
  ServiceProvider,
  ServiceLifetime,
} from "./ServiceProvider";

import { ServiceToken } from "./ServiceToken";

/**
 * Dependency Injection Container.
 *
 * Supports:
 * - Singleton services
 * - Transient services
 * - Lazy initialization
 * - Type-safe resolution
 */
export class Container {
  /**
   * Registered providers.
   */
  private readonly providers = new Map<
    ServiceToken<unknown>,
    ServiceProvider<unknown>
  >();

  /**
   * Singleton cache.
   */
  private readonly singletons = new Map<
    ServiceToken<unknown>,
    unknown
  >();

  /**
   * Register a service provider.
   */
  register<T>(
    provider: ServiceProvider<T>
  ): void {
    if (this.providers.has(provider.token)) {
      throw new ConfigurationError(
        `Service already registered: ${provider.token}`
      );
    }

    this.providers.set(
      provider.token,
      provider as ServiceProvider<unknown>
    );
  }

  /**
   * Resolve a service.
   */
  resolve<T>(
    token: ServiceToken<T>
  ): T {
    const provider = this.providers.get(
      token
    ) as ServiceProvider<T> | undefined;

    if (!provider) {
      throw new ConfigurationError(
        `Service not registered: ${token}`
      );
    }

    switch (provider.lifetime) {
      case ServiceLifetime.Singleton:
        return this.resolveSingleton(provider);

      case ServiceLifetime.Transient:
        return provider.factory(this);

      default:
        throw new ConfigurationError(
          `Unsupported service lifetime: ${provider.lifetime}`
        );
    }
  }

  /**
   * Resolve singleton instance.
   */
  private resolveSingleton<T>(
    provider: ServiceProvider<T>
  ): T {
    const cached = this.singletons.get(
      provider.token
    );

    if (cached) {
      return cached as T;
    }

    const instance = provider.factory(this);

    this.singletons.set(
      provider.token,
      instance
    );

    return instance;
  }

  /**
   * Returns true if a provider exists.
   */
  has(
    token: ServiceToken<unknown>
  ): boolean {
    return this.providers.has(token);
  }

  /**
   * Removes every registration.
   *
   * Intended for tests.
   */
  clear(): void {
    this.providers.clear();
    this.singletons.clear();
  }

  /**
   * Number of registered services.
   */
  size(): number {
    return this.providers.size;
  }

  /**
   * Returns all registered tokens.
   */
  tokens(): readonly ServiceToken<unknown>[] {
    return [...this.providers.keys()];
  }
}

/**
 * Global application container.
 */
export const container = new Container();