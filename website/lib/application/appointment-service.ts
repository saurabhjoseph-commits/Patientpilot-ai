/**
 * PatientPilot AI
 * Application Layer
 * Integration Service
 *
 * Coordinates external platform integrations through
 * the Platform Runtime Integration Manager.
 */

import {
  IntegrationManager,
  IntegrationRequest,
  IntegrationResponse,
} from "../platform/contracts/integration-manager";

import {
  integrationManager,
} from "../platform/runtime/integration-manager";

export interface IntegrationService {
  execute(
    integrationId: string,
    request: IntegrationRequest,
  ): Promise<IntegrationResponse>;

  isAvailable(
    integrationId: string,
  ): boolean;
}

/**
 * Default Integration Service.
 */
export class DefaultIntegrationService
  implements IntegrationService
{
  constructor(
    private readonly integrations: IntegrationManager =
      integrationManager,
  ) {}

  async execute(
    integrationId: string,
    request: IntegrationRequest,
  ): Promise<IntegrationResponse> {
    return this.integrations.execute(
      integrationId,
      request,
    );
  }

  isAvailable(
    integrationId: string,
  ): boolean {
    return this.integrations
      .list()
      .some(
        (integration) =>
          integration.id === integrationId &&
          integration.enabled,
      );
  }
}

/**
 * Creates an Integration Service.
 */
export function createIntegrationService(): IntegrationService {
  return new DefaultIntegrationService();
}

/**
 * Shared Integration Service.
 */
export const integrationService =
  createIntegrationService();

/**
 * Default Integration Service.
 */
export default integrationService;