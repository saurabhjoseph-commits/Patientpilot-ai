import type { CreateLeadRequest } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateLead(
  lead: CreateLeadRequest,
): ValidationResult {
  const errors: string[] = [];

  if (!lead.clinicName.trim()) {
    errors.push("Clinic name is required.");
  }

  if (!lead.dentistName.trim()) {
    errors.push("Dentist name is required.");
  }

  if (!lead.email.trim()) {
    errors.push("Email is required.");
  }

  if (!lead.phone.trim()) {
    errors.push("Phone is required.");
  }

  if (lead.monthlyCalls <= 0) {
    errors.push("Monthly calls must be greater than zero.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}