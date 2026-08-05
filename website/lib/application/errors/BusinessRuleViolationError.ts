/**
 * ============================================================
 * PatientPilot AI
 * Business Rule Violation Error
 * ============================================================
 *
 * Represents a violation of one or more business rules.
 *
 * Business rule violations are expected outcomes and should be
 * returned through ApplicationResult rather than thrown.
 */

import type { ApplicationError } from "./ApplicationError";

export interface BusinessRuleViolation {
  /**
   * Unique identifier of the violated rule.
   * Example:
   *  APPOINTMENT_SLOT_OCCUPIED
   *  PROVIDER_NOT_AVAILABLE
   *  CLINIC_INACTIVE
   */
  rule: string;

  /**
   * Human-readable explanation.
   */
  message: string;

  /**
   * Optional contextual information.
   */
  details?: Record<string, unknown>;
}

export interface BusinessRuleViolationError
  extends ApplicationError {
  readonly code: "BUSINESS_RULE_VIOLATION";

  readonly violations: readonly BusinessRuleViolation[];
}

export class BusinessRuleViolationErrorFactory {
  static create(
    violations: readonly BusinessRuleViolation[],
    message = "One or more business rules were violated.",
  ): BusinessRuleViolationError {
    return {
      code: "BUSINESS_RULE_VIOLATION",
      message,
      violations,
      details: {
        violationCount: violations.length,
      },
    };
  }

  static single(
    rule: string,
    message: string,
    details?: Record<string, unknown>,
  ): BusinessRuleViolationError {
    return this.create([
      {
        rule,
        message,
        details,
      },
    ]);
  }
}