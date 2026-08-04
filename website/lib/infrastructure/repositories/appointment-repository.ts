/**
 * PatientPilot AI
 * Infrastructure Layer
 * Appointment Repository
 *
 * Repository responsible for appointment persistence.
 */

import {
  DatabaseProvider,
  database,
} from "../persistence/database";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled"
  | "no-show";

export interface AppointmentRecord {
  readonly id: string;
  readonly clinicId: string;
  readonly patientId: string;
  readonly providerId?: string;
  readonly start: Date;
  readonly end: Date;
  readonly status: AppointmentStatus;
  readonly reason?: string;
}

export interface CreateAppointmentRecord {
  readonly clinicId: string;
  readonly patientId: string;
  readonly providerId?: string;
  readonly start: Date;
  readonly end: Date;
  readonly reason?: string;
}

export interface UpdateAppointmentRecord {
  readonly providerId?: string;
  readonly start?: Date;
  readonly end?: Date;
  readonly status?: AppointmentStatus;
  readonly reason?: string;
}

export interface AppointmentRepository {
  create(
    record: CreateAppointmentRecord,
  ): Promise<AppointmentRecord>;

  update(
    id: string,
    record: UpdateAppointmentRecord,
  ): Promise<AppointmentRecord>;

  findById(
    id: string,
  ): Promise<AppointmentRecord | null>;

  findByPatient(
    patientId: string,
  ): Promise<readonly AppointmentRecord[]>;

  findByClinic(
    clinicId: string,
  ): Promise<readonly AppointmentRecord[]>;

  delete(
    id: string,
  ): Promise<boolean>;
}

/**
 * Default Appointment Repository.
 */
export class DefaultAppointmentRepository
  implements AppointmentRepository
{
  constructor(
    private readonly provider: DatabaseProvider =
      database,
  ) {}

  async create(
    record: CreateAppointmentRecord,
  ): Promise<AppointmentRecord> {
    void this.provider;

    return {
      id: crypto.randomUUID(),
      clinicId: record.clinicId,
      patientId: record.patientId,
      providerId: record.providerId,
      start: record.start,
      end: record.end,
      status: "scheduled",
      reason: record.reason,
    };
  }

  async update(
    id: string,
    record: UpdateAppointmentRecord,
  ): Promise<AppointmentRecord> {
    return {
      id,
      clinicId: "",
      patientId: "",
      providerId: record.providerId,
      start: record.start ?? new Date(),
      end: record.end ?? new Date(),
      status: record.status ?? "scheduled",
      reason: record.reason,
    };
  }

  async findById(
    id: string,
  ): Promise<AppointmentRecord | null> {
    void id;

    return null;
  }

  async findByPatient(
    patientId: string,
  ): Promise<readonly AppointmentRecord[]> {
    void patientId;

    return [];
  }

  async findByClinic(
    clinicId: string,
  ): Promise<readonly AppointmentRecord[]> {
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
 * Creates an Appointment Repository.
 */
export function createAppointmentRepository(): AppointmentRepository {
  return new DefaultAppointmentRepository();
}

/**
 * Shared Appointment Repository.
 */
export const appointmentRepository =
  createAppointmentRepository();

/**
 * Default Appointment Repository.
 */
export default appointmentRepository;