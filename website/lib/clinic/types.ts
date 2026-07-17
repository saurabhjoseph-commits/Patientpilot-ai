import type { BaseEntity } from "@/lib/core/repository";

export type ClinicStatus =
  | "active"
  | "inactive"
  | "trial"
  | "suspended";

export interface Clinic extends BaseEntity {
  name: string;
  slug: string;

  email: string;
  phone: string;

  website?: string;

  country: string;
  timezone: string;
  currency: string;

  status: ClinicStatus;
}

export interface CreateClinicRequest {
  name: string;
  slug: string;

  email: string;
  phone: string;

  website?: string;

  country: string;
  timezone: string;
  currency: string;
}

export interface UpdateClinicRequest
  extends Partial<CreateClinicRequest> {
  status?: ClinicStatus;
}
export interface Clinic extends BaseEntity {
  name: string;
  slug: string;

  email: string;
  phone: string;
  website?: string;
  logoUrl?: string;   // ← Add this

  country: string;
  timezone: string;
  currency: string;

  status: ClinicStatus;
}

export interface CreateClinicRequest {
  name: string;
  slug: string;

  email: string;
  phone: string;
  website?: string;
  logoUrl?: string;   // ← Add this

  country: string;
  timezone: string;
  currency: string;
}