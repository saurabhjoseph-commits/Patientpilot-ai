import { DoctorRepository } from "./repository";
import { validateCreateDoctor, validateUpdateDoctor } from "./validation";
import type { CreateDoctorInput, DoctorFilters, DoctorServiceAssignment, UpdateDoctorInput } from "./types";

export class DoctorService {
  constructor(private readonly repository = new DoctorRepository()) {}
  list(filters: DoctorFilters) { return this.repository.list(filters); }
  get(clinicId: string, id: string) { return this.repository.findById(clinicId, id); }
  async create(input: CreateDoctorInput) { const error = validateCreateDoctor(input); if (error) throw new Error(error); return this.repository.create(input); }
  async update(clinicId: string, id: string, input: UpdateDoctorInput) { const error = validateUpdateDoctor(input); if (error) throw new Error(error); return this.repository.update(clinicId, id, input); }
  async setServices(clinicId: string, doctorId: string, assignments: readonly DoctorServiceAssignment[]) { if (!await this.repository.findById(clinicId, doctorId)) throw new Error("Doctor not found."); return this.repository.replaceServices(clinicId, doctorId, assignments); }
  assignedServiceIds(clinicId: string, doctorId: string) { return this.repository.assignedServiceIds(clinicId, doctorId); }
  scheduleSummaries(clinicId: string, doctorIds: readonly string[]) { return this.repository.scheduleSummaries(clinicId, doctorIds); }
}

export function createDoctorService() { return new DoctorService(); }
