import type {
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Patient Validation
 * ============================================================
 */

export interface ValidationResult {
  valid: boolean;

  score: number;

  errors: string[];
}

const PHONE_REGEX =
  /^(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

/**
 * ============================================================
 * First Name
 * ============================================================
 */

export function validateFirstName(
  name: string
): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("First name is required.");
  } else if (name.trim().length < 2) {
    errors.push("First name is too short.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Last Name
 * ============================================================
 */

export function validateLastName(
  name: string
): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("Last name is required.");
  } else if (name.trim().length < 2) {
    errors.push("Last name is too short.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Phone Number
 * ============================================================
 */

export function validatePhoneNumber(
  phone: string
): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push("Phone number is required.");
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.push("Invalid phone number.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Email
 * ============================================================
 */

export function validateEmail(
  email?: string
): ValidationResult {
  if (!email) {
    return {
      valid: true,
      score: 100,
      errors: [],
    };
  }

  const errors: string[] = [];

  if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email address.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Create Patient
 * ============================================================
 */

export function validateCreatePatient(
  patient: CreatePatientInput
): ValidationResult {
  const validations = [
    validateFirstName(patient.firstName),
    validateLastName(patient.lastName),
    validatePhoneNumber(patient.phoneNumber),
    validateEmail(patient.email),
  ];

  const errors = validations.flatMap(
    (v) => v.errors
  );

  const passed =
    validations.filter((v) => v.valid).length;

  return {
    valid: errors.length === 0,
    score: Math.round(
      (passed / validations.length) * 100
    ),
    errors,
  };
}

/**
 * ============================================================
 * Update Patient
 * ============================================================
 */

export function validateUpdatePatient(
  patient: UpdatePatientInput
): ValidationResult {
  const errors: string[] = [];

  if (patient.firstName !== undefined) {
    errors.push(
      ...validateFirstName(
        patient.firstName
      ).errors
    );
  }

  if (patient.lastName !== undefined) {
    errors.push(
      ...validateLastName(
        patient.lastName
      ).errors
    );
  }

  if (patient.phoneNumber !== undefined) {
    errors.push(
      ...validatePhoneNumber(
        patient.phoneNumber
      ).errors
    );
  }

  if (patient.email !== undefined) {
    errors.push(
      ...validateEmail(
        patient.email
      ).errors
    );
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Existing Patient
 * ============================================================
 */

export function validatePatient(
  patient: Patient
): ValidationResult {
  return validateCreatePatient({
    clinicName: patient.clinicName,
    firstName: patient.firstName,
    lastName: patient.lastName,
    phoneNumber: patient.phoneNumber,
    email: patient.email,
    dateOfBirth: patient.dateOfBirth,
    preferredContactMethod:
      patient.preferredContactMethod,
    preferredDentist:
      patient.preferredDentist,
    notes: patient.notes,
  });
}