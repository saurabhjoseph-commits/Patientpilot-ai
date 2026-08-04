/**
 * PatientPilot AI
 * Platform Runtime - Common Contracts
 *
 * Shared platform types used throughout the runtime.
 */

/**
 * Generic identifier.
 */
export type Identifier = string;

/**
 * ISO-8601 timestamp.
 */
export type Timestamp = Date;

/**
 * JSON primitive.
 */
export type Primitive =
  | string
  | number
  | boolean
  | null;

/**
 * Recursive JSON value.
 */
export type JsonValue =
  | Primitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

/**
 * Generic metadata dictionary.
 */
export type Metadata = Readonly<
  Record<string, JsonValue>
>;

/**
 * Generic attributes dictionary.
 */
export type Attributes = Readonly<
  Record<string, JsonValue>
>;

/**
 * Platform execution context.
 */
export interface ExecutionContext {
  readonly correlationId?: Identifier;
  readonly causationId?: Identifier;
  readonly tenantId?: Identifier;
  readonly userId?: Identifier;
  readonly timestamp: Timestamp;
}

/**
 * Named platform resource.
 */
export interface NamedResource {
  readonly id: Identifier;
  readonly name: string;
}

/**
 * Versioned platform resource.
 */
export interface VersionedResource
  extends NamedResource {
  readonly version: string;
}

/**
 * Enable / disable contract.
 */
export interface Toggleable {
  readonly enabled: boolean;
}

/**
 * Audit information.
 */
export interface AuditInfo {
  readonly createdAt: Timestamp;
  readonly updatedAt?: Timestamp;
}

/**
 * Base platform error.
 */
export class PlatformError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformError";
  }
}