/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Base Event Contract
 * ============================================================
 */

import { generateId } from "../utils/id";

export interface EventMetadata {
  clinicId?: string;
  patientId?: string;
  conversationId?: string;
  workflowId?: string;
  requestId?: string;
  userId?: string;

  [key: string]: unknown;
}

/**
 * Base interface implemented by all platform events.
 */
export interface Event<TPayload = unknown> {
  /**
   * Unique event identifier.
   */
  id: string;

  /**
   * Event name.
   *
   * Examples:
   * AppointmentBooked
   * PatientCreated
   * MessageReceived
   */
  type: string;

  /**
   * UTC timestamp.
   */
  timestamp: string;

  /**
   * Event payload.
   */
  payload: TPayload;

  /**
   * Optional event metadata.
   */
  metadata?: EventMetadata;

  /**
   * Event version.
   */
  version: number;
}

/**
 * Creates a new platform event.
 */
export function createEvent<TPayload>(
  type: string,
  payload: TPayload,
  metadata?: EventMetadata
): Event<TPayload> {
  return {
    id: generateId(),

    type,

    timestamp: new Date().toISOString(),

    payload,

    metadata,

    version: 1,
  };
}