import type {
  CreateLeadRequest,
  Lead,
} from "./types";

/**
 * Maps a CreateLeadRequest into a Supabase row.
 */
export function toDatabaseLead(
  lead: CreateLeadRequest
) {
  return {
    clinic_name: lead.clinicName,
    dentist_name: lead.dentistName,
    email: lead.email,
    phone: lead.phone,
    monthly_calls: lead.monthlyCalls,
    message: lead.message ?? null,
    status: "New",
  };
}

/**
 * Maps a Supabase row into a Lead domain model.
 */
export function fromDatabaseLead(row: any): Lead {
  return {
    id: row.id,
    clinicName: row.clinic_name,
    dentistName: row.dentist_name,
    email: row.email,
    phone: row.phone,
    monthlyCalls: row.monthly_calls,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}