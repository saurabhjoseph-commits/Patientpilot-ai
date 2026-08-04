/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Service Tokens
 * ============================================================
 */

/**
 * Typed identifier for a service.
 *
 * Example:
 * const LOGGER =
 *   createServiceToken<Logger>("core.logger");
 */
export class ServiceToken<T = unknown> {
  constructor(
    public readonly name: string
  ) {}

  toString(): string {
    return this.name;
  }
}

/**
 * Creates a strongly typed service token.
 */
export function createServiceToken<T>(
  name: string
): ServiceToken<T> {
  return new ServiceToken<T>(name);
}