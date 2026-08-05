/**
 * PatientPilot AI
 * Infrastructure Layer
 * Domain Event Factory
 *
 * Creates standardized domain events.
 */

import type {
  DomainEvent,
} from "./domain-event-publisher";

export interface CreateDomainEventOptions {
  readonly type: string;
  readonly aggregateId: string;
  readonly payload?: Readonly<Record<string, unknown>>;
}

export function createDomainEvent(
  options: CreateDomainEventOptions,
): DomainEvent {
  return {
    type: options.type,
    aggregateId: options.aggregateId,
    occurredAt: new Date(),
    payload: options.payload ?? {},
  };
}

/**
 * Convenience factory for Lead events.
 */
export function createLeadEvent(
  aggregateId: string,
  action: string,
  payload: Readonly<Record<string, unknown>> = {},
): DomainEvent {
  return createDomainEvent({
    type: `Lead.${action}`,
    aggregateId,
    payload,
  });
}

/**
 * Convenience factory for Appointment events.
 */
export function createAppointmentEvent(
  aggregateId: string,
  action: string,
  payload: Readonly<Record<string, unknown>> = {},
): DomainEvent {
  return createDomainEvent({
    type: `Appointment.${action}`,
    aggregateId,
    payload,
  });
}

/**
 * Convenience factory for Conversation events.
 */
export function createConversationEvent(
  aggregateId: string,
  action: string,
  payload: Readonly<Record<string, unknown>> = {},
): DomainEvent {
  return createDomainEvent({
    type: `Conversation.${action}`,
    aggregateId,
    payload,
  });
}