/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Base Application Error
 * ============================================================
 */

import { generateId } from "../utils/id";

export interface ErrorContext {
  field?: string;
  value?: unknown;
  clinicId?: string;
  patientId?: string;
  conversationId?: string;
  workflowId?: string;
  [key: string]: unknown;
}

export interface ErrorOptions {
  code: string;
  statusCode?: number;
  context?: ErrorContext;
  cause?: unknown;
}

/**
 * Base class for all application errors.
 */
export class AppError extends Error {
  public readonly id: string;

  public readonly code: string;

  public readonly statusCode: number;

  public readonly timestamp: string;

  public readonly context?: ErrorContext;

  public override readonly cause?: unknown;

  constructor(
    message: string,
    options: ErrorOptions
  ) {
    super(message);

    this.name = this.constructor.name;

    this.id = generateId();

    this.code = options.code;

    this.statusCode = options.statusCode ?? 500;

    this.timestamp = new Date().toISOString();

    this.context = options.context;

    this.cause = options.cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Returns a serializable representation.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
    };
  }

  /**
   * Returns true if this is a client error.
   */
  get isClientError(): boolean {
    return this.statusCode >= 400 &&
           this.statusCode < 500;
  }

  /**
   * Returns true if this is a server error.
   */
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}