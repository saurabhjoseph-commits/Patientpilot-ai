/**
 * ============================================================
 * PatientPilot AI
 * Clinic Repository
 * ============================================================
 *
 * Application Layer contract for clinic persistence.
 *
 * This interface is implemented by the Infrastructure Layer
 * (Supabase, PostgreSQL, etc.).
 */

import type { Clinic } from "@/lib/platform/domain/clinic";

export interface CreateClinicData {
  name: string;

  slug: string;

  email: string;

  phone?: string;

  website?: string;

  address?: string;

  city?: string;

  state?: string;

  country: string;

  timezone: string;

  logoUrl?: string;
}

export interface UpdateClinicData {
  name?: string;

  email?: string;

  phone?: string;

  website?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  timezone?: string;

  logoUrl?: string;
}

export interface IClinicRepository {
  /**
   * Returns the clinic by its identifier.
   */
  findById(
    clinicId: string,
  ): Promise<Clinic | null>;

  /**
   * Returns the clinic by its unique slug.
   */
  findBySlug(
    slug: string,
  ): Promise<Clinic | null>;

  /**
   * Returns the clinic by its primary email.
   */
  findByEmail(
    email: string,
  ): Promise<Clinic | null>;

  /**
   * Returns true if the slug already exists.
   */
  existsBySlug(
    slug: string,
  ): Promise<boolean>;

  /**
   * Returns true if the email already exists.
   */
  existsByEmail(
    email: string,
  ): Promise<boolean>;

  /**
   * Persists a new clinic.
   */
  create(
    data: CreateClinicData,
  ): Promise<Clinic>;

  /**
   * Updates an existing clinic.
   */
  update(
    clinicId: string,
    data: UpdateClinicData,
  ): Promise<Clinic>;

  /**
   * Deletes a clinic.
   */
  delete(
    clinicId: string,
  ): Promise<void>;
}