/**
 * PatientPilot AI
 * Infrastructure Layer
 * Clinic Repository
 *
 * Repository responsible for clinic persistence.
 */

import {
  DatabaseProvider,
  database,
} from "../persistence/database";

export interface ClinicRecord {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly timezone?: string;
  readonly active: boolean;
}

export interface CreateClinicRecord {
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly timezone?: string;
}

export interface UpdateClinicRecord {
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly timezone?: string;
  readonly active?: boolean;
}

export interface ClinicRepository {
  create(
    record: CreateClinicRecord,
  ): Promise<ClinicRecord>;

  update(
    id: string,
    record: UpdateClinicRecord,
  ): Promise<ClinicRecord>;

  findById(
    id: string,
  ): Promise<ClinicRecord | null>;

  findAll(): Promise<readonly ClinicRecord[]>;

  delete(
    id: string,
  ): Promise<boolean>;
}

export class DefaultClinicRepository
  implements ClinicRepository
{
  constructor(
    private readonly provider: DatabaseProvider =
      database,
  ) {}

  async create(
    record: CreateClinicRecord,
  ): Promise<ClinicRecord> {
    void this.provider;

    return {
      id: crypto.randomUUID(),
      name: record.name,
      email: record.email,
      phone: record.phone,
      timezone: record.timezone,
      active: true,
    };
  }

  async update(
    id: string,
    record: UpdateClinicRecord,
  ): Promise<ClinicRecord> {
    return {
      id,
      name: record.name ?? "",
      email: record.email,
      phone: record.phone,
      timezone: record.timezone,
      active: record.active ?? true,
    };
  }

  async findById(
    id: string,
  ): Promise<ClinicRecord | null> {
    void id;

    return null;
  }

  async findAll(): Promise<
    readonly ClinicRecord[]
  > {
    return [];
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    void id;

    return true;
  }
}

/**
 * Creates a Clinic Repository.
 */
export function createClinicRepository(): ClinicRepository {
  return new DefaultClinicRepository();
}

/**
 * Shared Clinic Repository.
 */
export const clinicRepository =
  createClinicRepository();

/**
 * Default Clinic Repository.
 */
export default clinicRepository;