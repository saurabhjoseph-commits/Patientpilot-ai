// website/lib/ai/context/tenant.ts

import type { TenantContext } from "./types";

/**
 * ============================================================
 * Default Tenant Context
 * ============================================================
 */

const DEFAULT_TENANT: TenantContext = {
  id: "default",

  slug: "patientpilot",

  country: "US",

  locale: "en-US",

  currency: "USD",
};

export function getTenantContext(): TenantContext {
  return DEFAULT_TENANT;
}