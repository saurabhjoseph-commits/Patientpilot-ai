/**
 * ============================================================
 * PatientPilot AI
 * Event Publisher
 * ============================================================
 *
 * Application Layer contract for publishing application
 * and domain events.
 *
 * Implemented by the Infrastructure Layer.
 */

export interface ApplicationEvent<TPayload = unknown> {
  /**
   * Unique event identifier.
   */
  readonly id: string;

  /**
   * Event name.
   *
   * Example:
   * ClinicRegistered
   * AppointmentBooked
   * FollowUpExecuted
   */
  readonly type: string;

  /**
   * Event creation timestamp.
   */
  readonly occurredAt: Date;

  /**
   * Tenant (clinic) identifier.
   */
  readonly clinicId?: string;

  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId?: string;

  /**
   * Event payload.
   */
  readonly payload: TPayload;
}

export interface IEventPublisher {
  /**
   * Publishes a single event.
   */
  publish<TPayload>(
    event: ApplicationEvent<TPayload>,
  ): Promise<void>;

  /**
   * Publishes multiple events atomically when supported
   * by the infrastructure implementation.
   */
  publishAll(
    events: readonly ApplicationEvent[],
  ): Promise<void>;
}