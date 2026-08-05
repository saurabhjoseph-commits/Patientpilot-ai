import {
  IntegrationDefinition,
  IntegrationManager,
  IntegrationManagerError,
  IntegrationRequest,
  IntegrationResponse,
} from "../contracts/integration-manager";

/**
 * Default runtime implementation of the Integration Manager.
 *
 * Responsible for:
 * - registering integrations
 * - executing integrations
 * - maintaining the integration registry
 *
 * Concrete integrations (Twilio, OpenAI, Stripe, Google Calendar,
 * Dentrix, Open Dental, etc.) are registered separately.
 */
export class DefaultIntegrationManager
  implements IntegrationManager
{
  private readonly integrations = new Map<
    string,
    IntegrationDefinition
  >();

  register(
    integration: IntegrationDefinition,
  ): void {
    if (this.integrations.has(integration.id)) {
      throw new IntegrationManagerError(
        `Integration "${integration.id}" is already registered.`,
      );
    }

    this.integrations.set(
      integration.id,
      Object.freeze(integration),
    );
  }

  unregister(
    integrationId: string,
  ): boolean {
    return this.integrations.delete(
      integrationId,
    );
  }

  list(): readonly IntegrationDefinition[] {
    return Object.freeze(
      [...this.integrations.values()],
    );
  }

  async execute(
    integrationId: string,
    request: IntegrationRequest,
  ): Promise<IntegrationResponse> {
    const integration =
      this.integrations.get(integrationId);

    if (!integration) {
      throw new IntegrationManagerError(
        `Integration "${integrationId}" is not registered.`,
      );
    }

    if (!integration.enabled) {
      return {
        success: false,
        error: "Integration is disabled.",
      };
    }

    return await Promise.resolve(
      integration.execute(request),
    );
  }

  clear(): void {
    this.integrations.clear();
  }
}

/**
 * Creates a new Integration Manager.
 */
export function createIntegrationManager(): IntegrationManager {
  return new DefaultIntegrationManager();
}

/**
 * Shared platform Integration Manager.
 */
export const integrationManager: IntegrationManager =
  createIntegrationManager();

/**
 * Default platform Integration Manager.
 */
export default integrationManager;