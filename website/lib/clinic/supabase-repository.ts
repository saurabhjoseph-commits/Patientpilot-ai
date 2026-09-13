import { AppError } from "@/lib/core/errors";
import type {
  PaginatedResult,
  PaginationOptions,
} from "@/lib/core/repository";
import { createClient } from "@/lib/supabase/server";

import { toClinic } from "./mapper";
import { CLINIC_COLUMNS, CLINICS_TABLE } from "./queries";
import type { ClinicRepository } from "./repository";
import type {
  Clinic,
  CreateClinicRequest,
  UpdateClinicRequest,
} from "./types";

type DatabaseClinicRow = {
  id: string;
  slug: string;
  name: string;
  status: Clinic["status"];
  email: string;
  phone: string;
  website: string | null;
  country: string;
  timezone: string;
  currency: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

function fromDatabaseClinic(row: DatabaseClinicRow): Clinic {
  return toClinic({
    id: row.id,
    slug: row.slug,
    name: row.name,
    status: row.status,
    email: row.email,
    phone: row.phone,
    website: row.website,
    country: row.country,
    timezone: row.timezone,
    currency: row.currency,
    logoUrl: row.logo_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export class SupabaseClinicRepository
  implements ClinicRepository
{
  private async db() {
    return createClient();
  }

  async findById(id: string): Promise<Clinic | null> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from(CLINICS_TABLE)
      .select(CLINIC_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new AppError("Failed to load clinic.", {
        code: "CLINIC_FETCH_FAILED",
      });
    }

    return data ? fromDatabaseClinic(data as DatabaseClinicRow) : null;
  }

  async findBySlug(slug: string): Promise<Clinic | null> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from(CLINICS_TABLE)
      .select(CLINIC_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new AppError("Failed to load clinic.", {
        code: "CLINIC_FETCH_FAILED",
      });
    }

    return data ? fromDatabaseClinic(data as DatabaseClinicRow) : null;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    return (await this.findBySlug(slug)) !== null;
  }

  async findAll(
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<Clinic>> {
    const supabase = await this.db();

    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 25;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(CLINICS_TABLE)
      .select(CLINIC_COLUMNS, {
        count: "exact",
      })
      .order("name")
      .range(from, to);

    if (error) {
      throw new AppError("Failed to load clinics.", {
        code: "CLINICS_FETCH_FAILED",
      });
    }

    return {
      data: (data ?? []).map((row) =>
        fromDatabaseClinic(row as DatabaseClinicRow),
      ),
      total: count ?? 0,
      page,
      pageSize,
    };
  }

  async create(
    _data: CreateClinicRequest,
  ): Promise<Clinic> {
    throw new Error("Not implemented.");
  }

  async update(
    _id: string,
    _data: UpdateClinicRequest,
  ): Promise<Clinic> {
    throw new Error("Not implemented.");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Not implemented.");
  }
}
