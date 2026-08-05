/**
 * PatientPilot AI
 * Platform Runtime - Integration Manager Contract
 *
 * Defines the contract for registering and executing
 * external platform integrations.
 */

export type IntegrationId = string;
export type IntegrationName = string;
export type IntegrationType = string;

export interface IntegrationRequest {
  /**
   * Request payload.
   */
  readonly payload?: Readonly<
    Record<string, unknown>
  >;
}

export interface IntegrationResponse {
  /**
   * Whether execution succeeded.
   */
  readonly success: boolean;

  /**
   * Optional response payload.
   */
  readonly payload?: Readonly<
    Record<string, unknown>
  >;

  /**
   * Optional error message.
   */
  readonly error?: string;
}

export interface IntegrationDefinition {
  /**
   * Unique integration identifier.
   */
  readonly id: IntegrationId;

  /**
   * Friendly integration name.
   */
  readonly name: IntegrationName;

  /**
   * Integration category.
   */
  readonly type: IntegrationType;

  /**
   * Whether the integration is enabled.
   */
  readonly enabled: boolean;

  /**
   * Execute the integration.
   */
  execute(
    request: IntegrationRequest,
  ):
    | Promise<IntegrationResponse>
    | IntegrationResponse;
}

export interface IntegrationManager {
  /**
   * Register an integration.
   */
  register(
    integration: IntegrationDefinition,
  ): void;

  /**
   * Remove an integration.
   */
  unregister(
    integrationId: IntegrationId,
  ): boolean;

  /**
   * Execute an integration by ID.
   */
  execute(
    integrationId: IntegrationId,
    request: IntegrationRequest,
  ): Promise<IntegrationResponse>;

  /**
   * List registered integrations.
   */
  list(): readonly IntegrationDefinition[];

  /**
   * Remove all integrations.
   */
  clear(): void;
}

/**
 * Base Integration Manager error.
 */
export class IntegrationManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IntegrationManagerError";
  }
}