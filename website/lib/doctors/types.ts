export type DoctorStatus = "active" | "inactive";

export interface Doctor {
  readonly id: string;
  readonly clinicId: string;
  readonly authUserId: string | null;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly qualification: string | null;
  readonly specialisation: string | null;
  readonly registrationNumber: string | null;
  readonly languages: readonly string[];
  readonly profilePhotoUrl: string | null;
  readonly defaultAppointmentDurationMinutes: number;
  readonly status: DoctorStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface DoctorServiceAssignment {
  readonly serviceId: string;
  readonly active: boolean;
  readonly customDurationMinutes?: number;
  readonly customPrice?: number;
}

export interface CreateDoctorInput {
  readonly clinicId: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone?: string;
  readonly qualification?: string;
  readonly specialisation?: string;
  readonly registrationNumber?: string;
  readonly languages?: readonly string[];
  readonly profilePhotoUrl?: string;
  readonly defaultAppointmentDurationMinutes: number;
}

export type UpdateDoctorInput = Omit<Partial<CreateDoctorInput>, "clinicId"> & { readonly status?: DoctorStatus };

export interface DoctorFilters {
  readonly clinicId: string;
  readonly query?: string;
  readonly status?: DoctorStatus;
  readonly sort?: "name" | "created";
  readonly page?: number;
  readonly pageSize?: number;
}

export interface DoctorPage {
  readonly doctors: readonly Doctor[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
