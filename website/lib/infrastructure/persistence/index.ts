/**
 * PatientPilot AI
 * Infrastructure Layer
 * Provider Registry
 *
 * Central registry for infrastructure providers.
 */

export interface Provider {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
}

export interface ProviderRegistry {
  register<T extends Provider>(
    provider: T,
  ): void;

  unregister(
    id: string,
  ): boolean;

  resolve<T extends Provider>(
    id: string,
  ): T | undefined;

  list(): readonly Provider[];
}

export class DefaultProviderRegistry
  implements ProviderRegistry
{
  private readonly providers =
    new Map<string, Provider>();

  register<T extends Provider>(
    provider: T,
  ): void {
    this.providers.set(
      provider.id,
      provider,
    );
  }

  unregister(
    id: string,
  ): boolean {
    return this.providers.delete(id);
  }

  resolve<T extends Provider>(
    id: string,
  ): T | undefined {
    return this.providers.get(
      id,
    ) as T | undefined;
  }

  list(): readonly Provider[] {
    return [
      ...this.providers.values(),
    ];
  }
}

/**
 * Shared Provider Registry.
 */
export const providerRegistry =
  new DefaultProviderRegistry();

export default providerRegistry;