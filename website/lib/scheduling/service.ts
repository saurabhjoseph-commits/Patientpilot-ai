import { SchedulingRepository, type BlockInput, type LeaveInput, type RoomAssignmentInput, type ScheduleInput } from "./repository";
import { validateBlock, validateLeave, validateRoomAssignment, validateSchedule } from "./validation";

export class SchedulingService {
  constructor(private readonly repository = new SchedulingRepository()) {}
  schedules(clinicId: string, doctorId: string) { return this.repository.schedules(clinicId, doctorId); }
  async addSchedule(clinicId: string, doctorId: string, input: ScheduleInput) { this.assert(validateSchedule(input)); return this.repository.addSchedule(clinicId, doctorId, input); }
  async updateSchedule(clinicId: string, doctorId: string, id: string, input: ScheduleInput) { this.assert(validateSchedule(input)); return this.repository.updateSchedule(clinicId, doctorId, id, input); }
  deactivateSchedule(clinicId: string, id: string) { return this.repository.deactivateSchedule(clinicId, id); }
  leaves(clinicId: string, doctorId: string) { return this.repository.leaves(clinicId, doctorId); }
  async addLeave(clinicId: string, doctorId: string, input: LeaveInput) { this.assert(validateLeave(input)); return this.repository.addLeave(clinicId, doctorId, input); }
  async updateLeave(clinicId: string, id: string, input: LeaveInput) { this.assert(validateLeave(input)); return this.repository.updateLeave(clinicId, id, input); }
  cancelLeave(clinicId: string, id: string) { return this.repository.cancelLeave(clinicId, id); }
  blockedTime(clinicId: string, doctorId?: string) { return this.repository.blockedTime(clinicId, doctorId); }
  async addBlockedTime(clinicId: string, input: BlockInput) { this.assert(validateBlock(input)); return this.repository.addBlockedTime(clinicId, input); }
  async updateBlockedTime(clinicId: string, id: string, input: BlockInput) { this.assert(validateBlock(input)); return this.repository.updateBlockedTime(clinicId, id, input); }
  cancelBlockedTime(clinicId: string, id: string) { return this.repository.cancelBlockedTime(clinicId, id); }
  roomAssignments(clinicId: string, doctorId: string) { return this.repository.roomAssignments(clinicId, doctorId); }
  roomAssignmentsForClinic(clinicId: string) { return this.repository.roomAssignmentsForClinic(clinicId); }
  async addRoomAssignment(clinicId: string, doctorId: string, input: RoomAssignmentInput) { this.assert(validateRoomAssignment(input)); return this.repository.addRoomAssignment(clinicId, doctorId, input); }
  async updateRoomAssignment(clinicId: string, id: string, input: RoomAssignmentInput) { this.assert(validateRoomAssignment(input)); return this.repository.updateRoomAssignment(clinicId, id, input); }
  async endRoomAssignment(clinicId: string, id: string, effectiveTo: string) { if (!effectiveTo) throw new Error("An assignment end date is required."); return this.repository.endRoomAssignment(clinicId, id, effectiveTo); }
  rooms(clinicId: string) { return this.repository.rooms(clinicId); }
  saveRoom(clinicId: string, input: { id?: string; name: string; code?: string; active: boolean }) { if (!input.name.trim()) throw new Error("Room name is required."); return this.repository.saveRoom(clinicId, input); }
  calendar(clinicId: string, from: string, to: string, filters?: { status?: string; doctorId?: string; serviceId?: string; roomId?: string }) { return this.repository.calendar(clinicId, from, to, filters); }
  private assert(error: string | null) { if (error) throw new Error(error); }
}
export function createSchedulingService() { return new SchedulingService(); }
