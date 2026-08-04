/**
 * PatientPilot AI
 * Platform Runtime - Event Bus Contract
 *
 * Defines the public eventing API for the platform runtime.
 * Implementations are provided by the runtime layer.
 */

export type EventId = string;
export type EventName = string;
export type EventVersion = string;
export type CorrelationId = string;
export type CausationId = string;
export type TenantId = string;

export interface PlatformEvent<
  TPayload = Readonly<Record<string, unknown>>,
> {
  /**
   * Unique event identifier.
   */
  readonly id: EventId;

  /**
   * Event name.
   * Example:
   * Lead.Created
   * Appointment.Booked
   */
  readonly name: EventName;

  /**
   * Event schema version.
   */
  readonly version: EventVersion;

  /**
   * Event creation time.
   */
  readonly occurredAt: Date;

  /**
   * Tenant that owns this event.
   */
  readonly tenantId?: TenantId;

  /**
   * Correlates related events.
   */
  readonly correlationId?: CorrelationId;

  /**
   * Parent event identifier.
   */
  readonly causationId?: CausationId;

  /**
   * Event payload.
   */
  readonly payload: TPayload;

  /**
   * Additional metadata.
   */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface EventContext {
  readonly correlationId?: CorrelationId;
  readonly causationId?: CausationId;
  readonly tenantId?: TenantId;
}

export interface EventPublishOptions {
  /**
   * Publish handlers sequentially.
   *
   * Default: false
   */
  readonly sequential?: boolean;

  /**
   * Continue invoking remaining handlers if one fails.
   *
   * Default: true
   */
  readonly continueOnError?: boolean;

  /**
   * Optional execution context.
   */
  readonly context?: EventContext;
}

export type EventHandler<
  TEvent extends PlatformEvent = PlatformEvent,
> = (event: TEvent) => void | Promise<void>;

export interface EventSubscription {
  /**
   * Event name.
   */
  readonly eventName: EventName;

  /**
   * Stops receiving future events.
   */
  unsubscribe(): void;
}

export interface EventBus {
  /**
   * Publish an event.
   */
  publish(
    event: PlatformEvent,
    options?: EventPublishOptions,
  ): Promise<void>;

  /**
   * Subscribe to an event.
   */
  subscribe(
    eventName: EventName,
    handler: EventHandler,
  ): EventSubscription;

  /**
   * Remove an existing handler.
   */
  unsubscribe(
    eventName: EventName,
    handler: EventHandler,
  ): boolean;

  /**
   * Remove every registered handler.
   */
  clear(): void;

  /**
   * Number of registered handlers.
   */
  handlerCount(eventName?: EventName): number;
}

/**
 * Base event bus error.
 */
export class EventBusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EventBusError";
  }
}