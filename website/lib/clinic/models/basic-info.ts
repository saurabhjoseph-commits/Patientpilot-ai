export type ClinicStatus =
  | "draft"
  | "active"
  | "inactive";

export interface ClinicBasicInfo {
  name: string;

  slug: string;

  email: string;

  phone: string;

  website: string;

  status: ClinicStatus;
}

export const DEFAULT_CLINIC_BASIC_INFO: ClinicBasicInfo = {
  name: "",

  slug: "",

  email: "",

  phone: "",

  website: "",

  status: "draft",
};

export function isClinicBasicInfoComplete(
  info: ClinicBasicInfo,
): boolean {
  return (
    info.name.trim().length > 0 &&
    info.slug.trim().length > 0
  );
}

export function normalizeClinicSlug(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateClinicSlug(
  clinicName: string,
): string {
  return normalizeClinicSlug(clinicName);
}

export function hasWebsite(
  info: ClinicBasicInfo,
): boolean {
  return info.website.trim().length > 0;
}

export function hasEmail(
  info: ClinicBasicInfo,
): boolean {
  return info.email.trim().length > 0;
}

export function hasPhone(
  info: ClinicBasicInfo,
): boolean {
  return info.phone.trim().length > 0;
}