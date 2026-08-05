/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Service Provider Contracts
 * ============================================================
 */

import type { ServiceToken } from "./ServiceToken";

/**
 * Supported service lifetimes.
 */
export enum ServiceLifetime {
  /**
   * One shared instance for the lifetime of the application.
   */
  Singleton = "singleton",

  /**
   * New instance created every time the service is resolved.
   */
  Transient = "transient",
}

/**
 * Service factory.
 *
 * Receives the container to allow dependency resolution.
 */
export type ServiceFactory<T> = (
  container: ServiceResolver
) => T;

/**
 * Minimal interface exposed to factories.
 *
 * This prevents factories from depending on the concrete
 * Container implementation.
 */
export interface ServiceResolver {
  resolve<T>(token: ServiceToken<T>): T;
}

/**
 * Service registration definition.
 */
export interface ServiceProvider<T> {
  /**
   * Service identifier.
   */
  token: ServiceToken<T>;

  /**
   * Service lifetime.
   */
  lifetime: ServiceLifetime;

  /**
   * Creates the service instance.
   */
  factory: ServiceFactory<T>;
}

/**
 * Helper for creating service providers.
 */
export function createServiceProvider<T>(
  token: ServiceToken<T>,
  factory: ServiceFactory<T>,
  lifetime: ServiceLifetime = ServiceLifetime.Singleton
): ServiceProvider<T> {
  return {
    token,
    lifetime,
    factory,
  };
}