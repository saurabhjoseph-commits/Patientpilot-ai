/** Canonical application contract aligned with public.appointments. */
export type AppointmentStatus = string;

export interface Appointment {
  readonly id: string;
  readonly clinicId: string;
  readonly patientName: string;
  readonly phone: string | null;
  readonly email: string | null;
  readonly service: string;
  readonly appointmentDate: string;
  readonly appointmentTime: string;
  readonly status: AppointmentStatus;
  readonly source: string;
  readonly notes: string | null;
  readonly createdAt: string;
}

export interface CreateAppointmentInput {
  readonly clinicId: string;
  readonly patientName: string;
  readonly phone: string;
  readonly email?: string;
  readonly service: string;
  readonly appointmentDate: string;
  readonly appointmentTime: string;
  readonly notes?: string;
  readonly source?: string;
}

export interface UpdateAppointmentInput {
  readonly patientName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly service?: string;
  readonly appointmentDate?: string;
  readonly appointmentTime?: string;
  readonly status?: AppointmentStatus;
  readonly source?: string;
  readonly notes?: string;
}

export interface AppointmentFilters {
  readonly clinicId: string;
  readonly status?: AppointmentStatus;
  readonly appointmentDate?: string;
  readonly patientName?: string;
  readonly phone?: string;
}

export interface AppointmentStats {
  readonly total: number;
  readonly pending: number;
  readonly confirmed: number;
  readonly completed: number;
  readonly cancelled: number;
  readonly rescheduled: number;
}
