import type { Clinic } from "./types";
import type { ClinicRecord } from "./schema";

export function toClinic(record: ClinicRecord): Clinic {
  return {
    ...record,
    website: record.website ?? undefined,
    logoUrl: record.logoUrl ?? undefined,
  };
}

export function toClinicRecord(clinic: Clinic): ClinicRecord {
  return {
    ...clinic,
    website: clinic.website ?? null,
    logoUrl: clinic.logoUrl ?? null,
  };
}