// website/lib/ai/context/clinic.ts

import type { ClinicContext } from "./types";

/**
 * ============================================================
 * Default Clinic Context
 * ============================================================
 *
 * Temporary implementation.
 *
 * Future:
 * - Load from Supabase
 * - Multi-tenant support
 */

const DEFAULT_CLINIC: ClinicContext = {
  id: "default",

  name: "Bright Smile Dental",

  timezone: "America/New_York",

  phoneNumber: "",

  email: "",

  businessHours: "",

  enabled: true,
};

export function getClinicContext(): ClinicContext {
  return DEFAULT_CLINIC;
}