import type { Repository } from "@/lib/core/repository";

import type {
  Clinic,
  CreateClinicRequest,
  UpdateClinicRequest,
} from "./types";

export interface ClinicRepository
  extends Repository<
    Clinic,
    CreateClinicRequest,
    UpdateClinicRequest
  > {
  findBySlug(slug: string): Promise<Clinic | null>;

  existsBySlug(slug: string): Promise<boolean>;
}