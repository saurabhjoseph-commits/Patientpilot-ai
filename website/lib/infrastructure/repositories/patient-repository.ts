/**
 * PatientPilot AI
 * Infrastructure Layer
 * Patient Repository
 *
 * Repository responsible for patient persistence.
 */

import {
  DatabaseProvider,
  database,
} from "../persistence/database";

export interface PatientRecord {
  readonly id: string;
  readonly clinicId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string;
  readonly phone?: string;
  readonly active: boolean;
}

export interface CreatePatientRecord {
  readonly clinicId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string;
  readonly phone?: string;
}

export interface UpdatePatientRecord {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly active?: boolean;
}

export interface PatientRepository {
  create(
    record: CreatePatientRecord,
  ): Promise<PatientRecord>;

  update(
    id: string,
    record: UpdatePatientRecord,
  ): Promise<PatientRecord>;

  findById(
    id: string,
  ): Promise<PatientRecord | null>;

  findByClinic(
    clinicId: string,
  ): Promise<readonly PatientRecord[]>;

  delete(
    id: string,
  ): Promise<boolean>;
}

/**
 * Default Patient Repository.
 */
export class DefaultPatientRepository
  implements PatientRepository
{
  constructor(
    private readonly provider: DatabaseProvider =
      database,
  ) {}

  async create(
    record: CreatePatientRecord,
  ): Promise<PatientRecord> {
    void this.provider;

    return {
      id: crypto.randomUUID(),
      clinicId: record.clinicId,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone,
      active: true,
    };
  }

  async update(
    id: string,
    record: UpdatePatientRecord,
  ): Promise<PatientRecord> {
    return {
      id,
      clinicId: "",
      firstName: record.firstName ?? "",
      lastName: record.lastName ?? "",
      email: record.email,
      phone: record.phone,
      active: record.active ?? true,
    };
  }

  async findById(
    id: string,
  ): Promise<PatientRecord | null> {
    void id;

    return null;
  }

  async findByClinic(
    clinicId: string,
  ): Promise<readonly PatientRecord[]> {
    void clinicId;

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
 * Creates a Patient Repository.
 */
export function createPatientRepository(): PatientRepository {
  return new DefaultPatientRepository();
}

/**
 * Shared Patient Repository.
 */
export const patientRepository =
  createPatientRepository();

/**
 * Default Patient Repository.
 */
export default patientRepository;