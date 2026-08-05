import {
  DuplicateEntityError,
  EntityMetadata,
  EntityName,
  EntityQuery,
  EntityRegistrationOptions,
  EntityRegistry,
  EntityRegistryError,
  EntityValidationError,
} from "../contracts/entity-registry";

/**
 * Creates an immutable copy of entity metadata.
 */
function freezeMetadata(metadata: EntityMetadata): EntityMetadata {
  return Object.freeze({
    ...metadata,
    tags: Object.freeze([...metadata.tags]),
    featureFlags: Object.freeze([...metadata.featureFlags]),
    metadata: metadata.metadata
      ? Object.freeze({ ...metadata.metadata })
      : undefined,
  });
}

/**
 * Runtime implementation of the platform entity registry.
 */
export class DefaultEntityRegistry implements EntityRegistry {
  private readonly entities = new Map<EntityName, EntityMetadata>();

  private frozen = false;

  constructor(
    initialEntities: readonly EntityMetadata[] = [],
  ) {
    for (const entity of initialEntities) {
      this.register(entity, {
        overwrite: false,
        validate: true,
      });
    }
  }

  /**
   * Ensures the registry is still mutable.
   */
  private ensureMutable(): void {
    if (this.frozen) {
      throw new EntityRegistryError(
        "The entity registry has been frozen and can no longer be modified.",
      );
    }
  }

  /**
   * Validates entity metadata before registration.
   */
  private validateMetadata(metadata: EntityMetadata): void {
    if (!metadata.name.trim()) {
      throw new EntityValidationError(
        "Entity name is required.",
      );
    }

    if (!metadata.displayName.trim()) {
      throw new EntityValidationError(
        "Display name is required.",
      );
    }

    if (!metadata.aggregate.trim()) {
      throw new EntityValidationError(
        "Aggregate name is required.",
      );
    }

    if (!metadata.version.trim()) {
      throw new EntityValidationError(
        "Version is required.",
      );
    }
  }

  /**
   * Registers a new entity.
   */
  register(
    metadata: EntityMetadata,
    options: EntityRegistrationOptions = {},
  ): void {
    this.ensureMutable();

    const {
      overwrite = false,
      validate = true,
    } = options;

    if (validate) {
      this.validateMetadata(metadata);
    }

    if (!overwrite && this.entities.has(metadata.name)) {
      throw new DuplicateEntityError(metadata.name);
    }

    this.entities.set(
      metadata.name,
      freezeMetadata(metadata),
    );
  }

  /**
   * Removes an entity registration.
   */
  unregister(name: EntityName): boolean {
    this.ensureMutable();

    return this.entities.delete(name);
  }
    /**
   * Determines whether an entity is registered.
   */
  has(name: EntityName): boolean {
    return this.entities.has(name);
  }

  /**
   * Retrieves entity metadata by name.
   */
  get(name: EntityName): EntityMetadata | undefined {
    return this.entities.get(name);
  }

  /**
   * Returns all registered entities.
   */
  list(): readonly EntityMetadata[] {
    return Object.freeze([...this.entities.values()]);
  }

  /**
   * Queries the registry using the supplied filter.
   */
  query(filter: EntityQuery = {}): readonly EntityMetadata[] {
    const results = [...this.entities.values()].filter((entity) => {
      if (
        filter.aggregate !== undefined &&
        entity.aggregate !== filter.aggregate
      ) {
        return false;
      }

      if (
        filter.tenantScoped !== undefined &&
        entity.tenantScoped !== filter.tenantScoped
      ) {
        return false;
      }

      if (
        filter.searchable !== undefined &&
        entity.searchable !== filter.searchable
      ) {
        return false;
      }

      if (
        filter.auditable !== undefined &&
        entity.auditable !== filter.auditable
      ) {
        return false;
      }

      if (
        filter.softDelete !== undefined &&
        entity.softDelete !== filter.softDelete
      ) {
        return false;
      }

      if (
        filter.tags &&
        !filter.tags.every((tag) => entity.tags.includes(tag))
      ) {
        return false;
      }

      if (
        filter.featureFlags &&
        !filter.featureFlags.every((flag) =>
          entity.featureFlags.includes(flag),
        )
      ) {
        return false;
      }

      return true;
    });

    return Object.freeze(results);
  }

  /**
   * Returns the number of registered entities.
   */
  count(): number {
    return this.entities.size;
  }

  /**
   * Removes every entity registration.
   */
  clear(): void {
    this.ensureMutable();
    this.entities.clear();
  }

  /**
   * Freezes the registry, preventing further modifications.
   */
  freeze(): void {
    this.frozen = true;
  }

  /**
   * Indicates whether the registry has been frozen.
   */
  isFrozen(): boolean {
    return this.frozen;
  }
}
/**
 * Creates a new entity registry instance.
 */
export function createEntityRegistry(
  initialEntities: readonly EntityMetadata[] = [],
): EntityRegistry {
  return new DefaultEntityRegistry(initialEntities);
}

/**
 * Shared platform entity registry.
 *
 * Most of the platform should use this singleton unless a dedicated
 * registry instance is required (for testing or isolated execution).
 */
export const entityRegistry: EntityRegistry =
  createEntityRegistry();

/**
 * Default platform registry.
 */
export default entityRegistry;