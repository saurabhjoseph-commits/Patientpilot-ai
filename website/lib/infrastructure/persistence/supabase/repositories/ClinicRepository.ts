/**
 * ============================================================
 * PatientPilot AI
 * Supabase Clinic Repository
 * ============================================================
 *
 * Infrastructure implementation of IClinicRepository.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Clinic } from "@/lib/platform/domain/clinic";

import type {
  CreateClinicData,
  IClinicRepository,
  UpdateClinicData,
} from "@/lib/application/interfaces/IClinicRepository";

export class ClinicRepository
  implements IClinicRepository
{
  constructor(
    private readonly db: SupabaseClient,
  ) {}

  async findById(
    clinicId: string,
  ): Promise<Clinic | null> {
    const { data, error } = await this.db
      .from("clinics")
      .select("*")
      .eq("id", clinicId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Clinic | null;
  }

  async findBySlug(
    slug: string,
  ): Promise<Clinic | null> {
    const { data, error } = await this.db
      .from("clinics")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Clinic | null;
  }

  async findByEmail(
    email: string,
  ): Promise<Clinic | null> {
    const { data, error } = await this.db
      .from("clinics")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Clinic | null;
  }

  async existsBySlug(
    slug: string,
  ): Promise<boolean> {
    const { count, error } = await this.db
      .from("clinics")
      .select("id", {
        head: true,
        count: "exact",
      })
      .eq("slug", slug);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  }

  async existsByEmail(
    email: string,
  ): Promise<boolean> {
    const { count, error } = await this.db
      .from("clinics")
      .select("id", {
        head: true,
        count: "exact",
      })
      .eq("email", email);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  }

  async create(
    data: CreateClinicData,
  ): Promise<Clinic> {
    const { data: created, error } =
      await this.db
        .from("clinics")
        .insert({
          name: data.name,
          slug: data.slug,
          email: data.email,
          phone: data.phone,
          website: data.website,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          timezone: data.timezone,
          logo_url: data.logoUrl,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return created as Clinic;
  }

  async update(
    clinicId: string,
    data: UpdateClinicData,
  ): Promise<Clinic> {
    const { data: updated, error } =
      await this.db
        .from("clinics")
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          timezone: data.timezone,
          logo_url: data.logoUrl,
        })
        .eq("id", clinicId)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return updated as Clinic;
  }

  async delete(
    clinicId: string,
  ): Promise<void> {
    const { error } = await this.db
      .from("clinics")
      .delete()
      .eq("id", clinicId);

    if (error) {
      throw error;
    }
  }
}