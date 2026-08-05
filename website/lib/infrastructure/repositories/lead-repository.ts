/**
 * PatientPilot AI
 * Infrastructure Layer
 * Lead Repository
 *
 * Repository responsible for lead persistence.
 */

import {
  DatabaseProvider,
  database,
} from "../persistence/database";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "demo-scheduled"
  | "converted"
  | "lost";

export interface LeadRecord {
  readonly id: string;
  readonly clinicId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string;
  readonly phone?: string;
  readonly source?: string;
  readonly status: LeadStatus;
}

export interface CreateLeadRecord {
  readonly clinicId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string;
  readonly phone?: string;
  readonly source?: string;
}

export interface UpdateLeadRecord {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly source?: string;
  readonly status?: LeadStatus;
}

export interface LeadRepository {
  create(
    record: CreateLeadRecord,
  ): Promise<LeadRecord>;

  update(
    id: string,
    record: UpdateLeadRecord,
  ): Promise<LeadRecord>;

  findById(
    id: string,
  ): Promise<LeadRecord | null>;

  findByClinic(
    clinicId: string,
  ): Promise<readonly LeadRecord[]>;

  findByStatus(
    clinicId: string,
    status: LeadStatus,
  ): Promise<readonly LeadRecord[]>;

  delete(
    id: string,
  ): Promise<boolean>;
}

/**
 * Default Lead Repository.
 */
export class DefaultLeadRepository
  implements LeadRepository
{
  constructor(
    private readonly provider: DatabaseProvider =
      database,
  ) {}

  async create(
    record: CreateLeadRecord,
  ): Promise<LeadRecord> {
    void this.provider;

    return {
      id: crypto.randomUUID(),
      clinicId: record.clinicId,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone,
      source: record.source,
      status: "new",
    };
  }

  async update(
    id: string,
    record: UpdateLeadRecord,
  ): Promise<LeadRecord> {
    return {
      id,
      clinicId: "",
      firstName: record.firstName ?? "",
      lastName: record.lastName ?? "",
      email: record.email,
      phone: record.phone,
      source: record.source,
      status: record.status ?? "new",
    };
  }

  async findById(
    id: string,
  ): Promise<LeadRecord | null> {
    void id;

    return null;
  }

  async findByClinic(
    clinicId: string,
  ): Promise<readonly LeadRecord[]> {
    void clinicId;

    return [];
  }

  async findByStatus(
    clinicId: string,
    status: LeadStatus,
  ): Promise<readonly LeadRecord[]> {
    void clinicId;
    void status;

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
 * Creates a Lead Repository.
 */
export function createLeadRepository(): LeadRepository {
  return new DefaultLeadRepository();
}

/**
 * Shared Lead Repository.
 */
export const leadRepository =
  createLeadRepository();

/**
 * Default Lead Repository.
 */
export default leadRepository;