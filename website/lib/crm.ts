// ======================================================
// PatientPilot AI CRM Helpers
// ======================================================

import { Lead, LeadStatus } from "@/types/crm";
import { isValidLeadStatus } from "@/lib/crm-status";

/**
 * Converts a raw Supabase row into a fully typed Lead
 * with safe defaults for nullable fields.
 */
export function normalizeLead(raw: Record<string, unknown>): Lead {
  const status =
    typeof raw.status === "string" &&
    isValidLeadStatus(raw.status)
      ? raw.status
      : "New";

  return {
    id: Number(raw.id),

    clinic_name: String(raw.clinic_name ?? ""),

    dentist_name: String(raw.dentist_name ?? ""),

    email: String(raw.email ?? ""),

    phone: String(raw.phone ?? ""),

    monthly_calls: String(raw.monthly_calls ?? ""),

    message:
      raw.message == null
        ? null
        : String(raw.message),

    status: status as LeadStatus,

    notes:
      raw.notes == null
        ? null
        : String(raw.notes),

    contacted_at:
      raw.contacted_at == null
        ? null
        : String(raw.contacted_at),

    demo_date:
      raw.demo_date == null
        ? null
        : String(raw.demo_date),

    converted: Boolean(raw.converted),

    clinic_id:
      raw.clinic_id == null
        ? null
        : String(raw.clinic_id),

    created_at: String(raw.created_at),

    updated_at:
      raw.updated_at == null
        ? null
        : String(raw.updated_at),
  };
}