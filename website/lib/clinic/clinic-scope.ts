import "server-only";

import type { RequestAuthorizationContext } from "@/lib/infrastructure/identity/AuthorizationContext";

export interface ClinicScope {
  readonly clinicId: string;
  readonly source: "admin" | "public-intake" | "telephony" | "workflow";
}

export class ClinicResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClinicResolutionError";
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function resolveAdminClinic(context: RequestAuthorizationContext): ClinicScope {
  return createClinicScope(context.clinicId, "admin");
}

export function resolvePublicIntakeClinic(): ClinicScope {
  const clinicId = process.env.PUBLIC_INTAKE_CLINIC_ID ?? "";
  if (!UUID_PATTERN.test(clinicId)) {
    throw new ClinicResolutionError("PUBLIC_INTAKE_CLINIC_ID must be configured as a UUID.");
  }
  return { clinicId, source: "public-intake" };
}

export function resolveTelephonyClinic(phoneNumber: string): ClinicScope {
  const mappings = parseTelephonyMappings(process.env.TELEPHONY_CLINIC_PHONE_MAP);
  const clinicId = mappings[normalizePhone(phoneNumber)];
  if (!clinicId) {
    throw new ClinicResolutionError("No trusted telephony clinic mapping exists for this destination number.");
  }
  return createClinicScope(clinicId, "telephony");
}

function createClinicScope(clinicId: string, source: ClinicScope["source"]): ClinicScope {
  if (!UUID_PATTERN.test(clinicId)) {
    throw new ClinicResolutionError("A trusted clinic scope is required.");
  }
  return { clinicId, source };
}

function parseTelephonyMappings(value: string | undefined): Readonly<Record<string, string>> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([phone, clinicId]) =>
        normalizePhone(phone).length > 0 && typeof clinicId === "string" && UUID_PATTERN.test(clinicId),
      ).map(([phone, clinicId]) => [normalizePhone(phone), clinicId as string]),
    );
  } catch {
    return {};
  }
}

function normalizePhone(value: string): string {
  return value.replace(/[^+\d]/g, "");
}
