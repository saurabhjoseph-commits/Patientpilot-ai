import type { ClinicStatus } from "./types";

export interface ClinicRecord {
  id: string;

  slug: string;
  name: string;

  status: ClinicStatus;

  email: string;
  phone: string;
  website: string | null;

  country: string;
  timezone: string;
  currency: string;

  logoUrl: string | null;

  createdAt: string;
  updatedAt: string;
}