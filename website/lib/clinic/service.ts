import { AppError } from "@/lib/core/errors";
import { BaseService } from "@/lib/core/service";

import type { ClinicRepository } from "./repository";
import type {
  Clinic,
  CreateClinicRequest,
  UpdateClinicRequest,
} from "./types";

import { validateClinic } from "./validation";

export class ClinicService extends BaseService {
  constructor(
    private readonly repository: ClinicRepository,
  ) {
    super();
  }

  async getById(id: string): Promise<Clinic | null> {
    return this.repository.findById(id);
  }

  async getBySlug(slug: string): Promise<Clinic | null> {
    return this.repository.findBySlug(slug);
  }

  async list(page = 1, pageSize = 25) {
    return this.repository.findAll({
      page,
      pageSize,
    });
  }

  async create(
    request: CreateClinicRequest,
  ): Promise<Clinic> {
    const validation = validateClinic(request);

    if (!validation.valid) {
      throw new AppError(
        validation.errors.join("\n"),
        {
          code: "CLINIC_VALIDATION_FAILED",
        },
      );
    }

    if (
      await this.repository.existsBySlug(request.slug)
    ) {
      throw new AppError(
        "Clinic slug already exists.",
        {
          code: "CLINIC_SLUG_EXISTS",
        },
      );
    }

    this.log("Creating clinic", {
      slug: request.slug,
    });

    return this.repository.create(request);
  }

  async update(
    id: string,
    request: UpdateClinicRequest,
  ): Promise<Clinic> {
    return this.repository.update(id, request);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}