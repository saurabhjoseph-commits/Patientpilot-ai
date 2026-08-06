import type { CreateDoctorInput, UpdateDoctorInput } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreateDoctor(input: CreateDoctorInput): string | null {
  if (!input.clinicId.trim()) return "Trusted clinic scope is required.";
  if (input.fullName.trim().length < 2) return "Doctor name must contain at least two characters.";
  if (!EMAIL.test(input.email.trim())) return "A valid doctor email is required.";
  if (!Number.isInteger(input.defaultAppointmentDurationMinutes) || input.defaultAppointmentDurationMinutes <= 0) return "Appointment duration must be a positive whole number.";
  return null;
}

export function validateUpdateDoctor(input: UpdateDoctorInput): string | null {
  if (input.fullName !== undefined && input.fullName.trim().length < 2) return "Doctor name must contain at least two characters.";
  if (input.email !== undefined && !EMAIL.test(input.email.trim())) return "A valid doctor email is required.";
  if (input.defaultAppointmentDurationMinutes !== undefined && (!Number.isInteger(input.defaultAppointmentDurationMinutes) || input.defaultAppointmentDurationMinutes <= 0)) return "Appointment duration must be a positive whole number.";
  if (input.status !== undefined && input.status !== "active" && input.status !== "inactive") return "Invalid doctor status.";
  return null;
}
