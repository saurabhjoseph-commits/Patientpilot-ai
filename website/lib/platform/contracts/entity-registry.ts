/**
 * PatientPilot AI
 * Platform Runtime - Entity Registry Contract
 *
 * Defines the public contract for entity registration and discovery.
 * Implementations are provided by the runtime layer.
 */

export type EntityName = string;
export type AggregateName = string;
export type EntityTag = string;
export type FeatureFlag = string;

export interface EntityMetadata {
  /**
   * Unique entity name.
   * Example: "Lead", "Deal", "Appointment"
   */
  readonly name: EntityName;

  /**
   * Human-friendly display name.
   */
  readonly displayName: string;

  /**
   * Aggregate or bounded context.
   * Example: CRM, Scheduling, Billing
   */
  readonly aggregate: AggregateName;

  /**
   * Schema or entity version.
   */
  readonly version: string;

  /**
   * Multi-tenant entity.
   */
  readonly tenantScoped: boolean;

  /**
   * Included in platform search.
   */
  readonly searchable: boolean;

  /**
   * Generates audit events.
   */
  readonly auditable: boolean;

  /**
   * Uses soft deletion.
   */
  readonly softDelete: boolean;

  /**
   * Optional categorization tags.
   */
  readonly tags: readonly EntityTag[];

  /**
   * Required feature flags.
   */
  readonly featureFlags: readonly FeatureFlag[];

  /**
   * Additional extensible metadata.
   */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface EntityQuery {
  readonly aggregate?: AggregateName;

  readonly tenantScoped?: boolean;

  readonly searchable?: boolean;

  readonly auditable?: boolean;

  readonly softDelete?: boolean;

  /**
   * Entity must contain all specified tags.
   */
  readonly tags?: readonly EntityTag[];

  /**
   * Entity must require all specified feature flags.
   */
  readonly featureFlags?: readonly FeatureFlag[];
}

export interface EntityRegistrationOptions {
  /**
   * Replace existing registration if present.
   */
  readonly overwrite?: boolean;

  /**
   * Validate metadata before registration.
   */
  readonly validate?: boolean;
}

export interface EntityRegistry {
  /**
   * Register entity metadata.
   */
  register(
    metadata: EntityMetadata,
    options?: EntityRegistrationOptions
  ): void;

  /**
   * Remove an entity.
   */
  unregister(name: EntityName): boolean;

  /**
   * Determine whether an entity exists.
   */
  has(name: EntityName): boolean;

  /**
   * Retrieve entity metadata.
   */
  get(name: EntityName): EntityMetadata | undefined;

  /**
   * Return every registered entity.
   */
  list(): readonly EntityMetadata[];

  /**
   * Flexible metadata search.
   */
  query(filter?: EntityQuery): readonly EntityMetadata[];

  /**
   * Total registered entities.
   */
  count(): number;

  /**
   * Remove every registration.
   */
  clear(): void;

  /**
   * Prevent further modifications.
   */
  freeze(): void;

  /**
   * Indicates whether the registry is immutable.
   */
  isFrozen(): boolean;
}

/**
 * Base error for registry failures.
 */
export class EntityRegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityRegistryError";
  }
}

/**
 * Thrown when duplicate registration occurs.
 */
export class DuplicateEntityError extends EntityRegistryError {
  constructor(entityName: EntityName) {
    super(`Entity "${entityName}" is already registered.`);
    this.name = "DuplicateEntityError";
  }
}

/**
 * Thrown when metadata validation fails.
 */
export class EntityValidationError extends EntityRegistryError {
  constructor(message: string) {
    super(message);
    this.name = "EntityValidationError";
  }
}