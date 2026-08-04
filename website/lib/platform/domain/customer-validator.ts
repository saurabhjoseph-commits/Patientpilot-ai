/**
 * ============================================================
 * PatientPilot AI
 * Customer Validator
 * ============================================================
 */

import {
  Customer,
  CustomerMetrics,
  CustomerRecall,
} from "./customer.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCustomer(
  customer: Customer,
): ValidationResult {
  const errors: string[] = [];

  if (!customer.id.trim()) {
    errors.push("Customer ID is required.");
  }

  if (!customer.tenantId.trim()) {
    errors.push("Tenant ID is required.");
  }

  validateMetrics(customer.metrics, errors);
  validateRecall(customer.recall, errors);

  if (customer.insurance) {
    validateInsurance(customer, errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateMetrics(
  metrics: CustomerMetrics,
  errors: string[],
): void {
  if (metrics.lifetimeValue < 0) {
    errors.push("Lifetime value cannot be negative.");
  }

  if (metrics.totalAppointments < 0) {
    errors.push("Total appointments cannot be negative.");
  }

  if (metrics.completedAppointments < 0) {
    errors.push("Completed appointments cannot be negative.");
  }

  if (metrics.cancelledAppointments < 0) {
    errors.push("Cancelled appointments cannot be negative.");
  }

  if (metrics.noShowAppointments < 0) {
    errors.push("No-show appointments cannot be negative.");
  }

  if (metrics.totalTreatments < 0) {
    errors.push("Total treatments cannot be negative.");
  }

  if (metrics.averageVisitValue < 0) {
    errors.push("Average visit value cannot be negative.");
  }

  const appointmentTotal =
    metrics.completedAppointments +
    metrics.cancelledAppointments +
    metrics.noShowAppointments;

  if (appointmentTotal > metrics.totalAppointments) {
    errors.push(
      "Completed, cancelled, and no-show appointments cannot exceed total appointments.",
    );
  }
}

function validateRecall(
  recall: CustomerRecall,
  errors: string[],
): void {
  if (recall.recallIntervalMonths < 0) {
    errors.push(
      "Recall interval cannot be negative.",
    );
  }

  if (
    recall.lastVisitAt &&
    recall.nextRecallAt &&
    recall.nextRecallAt < recall.lastVisitAt
  ) {
    errors.push(
      "Next recall date cannot be earlier than the last visit date.",
    );
  }
}

function validateInsurance(
  customer: Customer,
  errors: string[],
): void {
  const insurance = customer.insurance!;

  if (
    insurance.verified &&
    !insurance.provider?.trim()
  ) {
    errors.push(
      "Verified insurance requires a provider.",
    );
  }

  if (
    insurance.verified &&
    !insurance.memberId?.trim()
  ) {
    errors.push(
      "Verified insurance requires a member ID.",
    );
  }
}