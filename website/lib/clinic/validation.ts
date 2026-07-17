import type { CreateClinicRequest } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateClinic(
  clinic: CreateClinicRequest,
): ValidationResult {
  const errors: string[] = [];

  if (!clinic.name.trim()) {
    errors.push("Clinic name is required.");
  }

  if (!clinic.slug.trim()) {
    errors.push("Clinic slug is required.");
  }

  if (!clinic.email.trim()) {
    errors.push("Clinic email is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}