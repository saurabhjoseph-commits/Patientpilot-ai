/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * Domain Event
 */

export interface DomainEventMetadata {
  correlationId?: string;

  causationId?: string;

  initiatedBy?: string;

  source?: string;

  traceId?: string;
}

export interface DomainEvent<
  TPayload = Record<string, unknown>,
> {
  id: string;

  type: string;

  aggregateId: string;

  aggregateType: string;

  tenantId: string;

  clinicId: string;

  occurredAt: Date;

  version: number;

  payload: TPayload;

  metadata?: DomainEventMetadata;
}

export function createDomainEvent<
  TPayload = Record<string, unknown>,
>(
  event: Omit<
    DomainEvent<TPayload>,
    "occurredAt"
  >,
): DomainEvent<TPayload> {
  return {
    ...event,
    occurredAt: new Date(),
  };
}