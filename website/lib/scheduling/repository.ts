import { supabaseServer } from "@/lib/supabase-server";
import { overlaps } from "./validation";

export type ScheduleInput = { weekday: number; startTime: string; endTime: string; breakStartTime?: string; breakEndTime?: string; effectiveFrom?: string; effectiveTo?: string; timezone: string };
export type LeaveInput = { startsOn: string; endsOn: string; reason?: string };
export type BlockInput = { doctorId?: string; roomId?: string; startsAt: string; endsAt: string; source?: string };
export type RoomAssignmentInput = { roomId: string; effectiveFrom?: string; effectiveTo?: string };
export type ScheduleRow = { id: string; weekday: number; start_time: string; end_time: string; break_start_time: string | null; break_end_time: string | null; effective_from: string | null; effective_to: string | null; timezone: string; active: boolean };
export type LeaveRow = { id: string; starts_on: string; ends_on: string; reason: string | null; active: boolean; created_at: string };
export type RoomAssignmentRow = { id: string; room_id: string; effective_from: string | null; effective_to: string | null; active: boolean; created_at: string };
export type ClinicRoomAssignmentRow = RoomAssignmentRow & { doctor_id: string };

export class SchedulingRepository {
  async schedules(clinicId: string, doctorId: string): Promise<ScheduleRow[]> { const { data, error } = await supabaseServer.from("doctor_schedules").select("id,weekday,start_time,end_time,break_start_time,break_end_time,effective_from,effective_to,timezone,active").eq("clinic_id", clinicId).eq("doctor_id", doctorId).order("weekday"); if (error) throw error; return (data ?? []) as unknown as ScheduleRow[]; }
  async addSchedule(clinicId: string, doctorId: string, input: ScheduleInput) {
    await this.assertScheduleDoesNotOverlap(clinicId, doctorId, input);
    return this.insert("doctor_schedules", { clinic_id: clinicId, doctor_id: doctorId, ...scheduleRow(input), active: true });
  }
  async updateSchedule(clinicId: string, doctorId: string, id: string, input: ScheduleInput) {
    await this.assertScheduleDoesNotOverlap(clinicId, doctorId, input, id);
    return this.update("doctor_schedules", clinicId, id, scheduleRow(input));
  }
  async deactivateSchedule(clinicId: string, id: string) { return this.update("doctor_schedules", clinicId, id, { active: false }); }

  async leaves(clinicId: string, doctorId: string): Promise<LeaveRow[]> { const { data, error } = await supabaseServer.from("doctor_leave").select("id,starts_on,ends_on,reason,active,created_at").eq("clinic_id", clinicId).eq("doctor_id", doctorId).order("starts_on"); if (error) throw error; return (data ?? []) as unknown as LeaveRow[]; }
  async addLeave(clinicId: string, doctorId: string, input: LeaveInput) { return this.insert("doctor_leave", { clinic_id: clinicId, doctor_id: doctorId, starts_on: input.startsOn, ends_on: input.endsOn, reason: input.reason || null, active: true }); }
  async updateLeave(clinicId: string, id: string, input: LeaveInput) { return this.update("doctor_leave", clinicId, id, { starts_on: input.startsOn, ends_on: input.endsOn, reason: input.reason || null }); }
  async cancelLeave(clinicId: string, id: string) { return this.update("doctor_leave", clinicId, id, { active: false }); }

  async blockedTime(clinicId: string, doctorId?: string) { let query = supabaseServer.from("blocked_time").select("id,doctor_id,room_id,starts_at,ends_at,source,active").eq("clinic_id", clinicId).order("starts_at"); if (doctorId) query = query.eq("doctor_id", doctorId); const { data, error } = await query; if (error) throw error; return data ?? []; }
  async addBlockedTime(clinicId: string, input: BlockInput) { return this.insert("blocked_time", { clinic_id: clinicId, doctor_id: input.doctorId ?? null, room_id: input.roomId ?? null, starts_at: input.startsAt, ends_at: input.endsAt, source: input.source?.trim() || null, active: true }); }
  async updateBlockedTime(clinicId: string, id: string, input: BlockInput) { return this.update("blocked_time", clinicId, id, { doctor_id: input.doctorId ?? null, room_id: input.roomId ?? null, starts_at: input.startsAt, ends_at: input.endsAt, source: input.source?.trim() || null }); }
  async cancelBlockedTime(clinicId: string, id: string) { return this.update("blocked_time", clinicId, id, { active: false }); }

  async roomAssignments(clinicId: string, doctorId: string): Promise<RoomAssignmentRow[]> { const { data, error } = await supabaseServer.from("doctor_room_assignments").select("id,room_id,effective_from,effective_to,active,created_at").eq("clinic_id", clinicId).eq("doctor_id", doctorId).order("created_at"); if (error) throw error; return (data ?? []) as unknown as RoomAssignmentRow[]; }
  async roomAssignmentsForClinic(clinicId: string): Promise<ClinicRoomAssignmentRow[]> { const { data, error } = await supabaseServer.from("doctor_room_assignments").select("id,doctor_id,room_id,effective_from,effective_to,active,created_at").eq("clinic_id", clinicId).order("created_at", { ascending: false }); if (error) throw error; return (data ?? []) as unknown as ClinicRoomAssignmentRow[]; }
  async addRoomAssignment(clinicId: string, doctorId: string, input: RoomAssignmentInput) { await this.assertRoomInClinic(clinicId, input.roomId); return this.insert("doctor_room_assignments", { clinic_id: clinicId, doctor_id: doctorId, room_id: input.roomId, effective_from: input.effectiveFrom || null, effective_to: input.effectiveTo || null, active: true }); }
  async updateRoomAssignment(clinicId: string, id: string, input: RoomAssignmentInput) { await this.assertRoomInClinic(clinicId, input.roomId); return this.update("doctor_room_assignments", clinicId, id, { room_id: input.roomId, effective_from: input.effectiveFrom || null, effective_to: input.effectiveTo || null }); }
  async endRoomAssignment(clinicId: string, id: string, effectiveTo: string) { return this.update("doctor_room_assignments", clinicId, id, { active: false, effective_to: effectiveTo }); }

  async rooms(clinicId: string) { const { data, error } = await supabaseServer.from("clinic_rooms").select("id,name,code,active").eq("clinic_id", clinicId).order("name"); if (error) throw error; return data ?? []; }
  async saveRoom(clinicId: string, input: { id?: string; name: string; code?: string; active: boolean }) { const row = { clinic_id: clinicId, name: input.name.trim(), code: input.code?.trim() || null, active: input.active }; return input.id ? this.update("clinic_rooms", clinicId, input.id, row) : this.insert("clinic_rooms", row); }
  async calendar(clinicId: string, from: string, to: string, filters: { status?: string; doctorId?: string; serviceId?: string; roomId?: string } = {}) { let query = supabaseServer.from("appointments").select("id,patient_name,service,appointment_date,appointment_time,status,source,notes,created_at,doctor_id,service_id,room_id,duration_minutes,checked_in_at,completed_at").eq("clinic_id", clinicId).gte("appointment_date", from).lte("appointment_date", to); if (filters.status) query = query.eq("status", filters.status); if (filters.doctorId) query = query.eq("doctor_id", filters.doctorId); if (filters.serviceId) query = query.eq("service_id", filters.serviceId); if (filters.roomId) query = query.eq("room_id", filters.roomId); const { data, error } = await query.order("appointment_date").order("appointment_time"); if (error) throw error; return data ?? []; }

  private async assertScheduleDoesNotOverlap(clinicId: string, doctorId: string, input: ScheduleInput, exceptId?: string) { const existing = await this.schedules(clinicId, doctorId); if (existing.some((row) => row.id !== exceptId && row.weekday === input.weekday && row.active && overlaps(input.startTime, input.endTime, row.start_time, row.end_time))) throw new Error("Schedule overlaps an existing working period."); }
  private async assertRoomInClinic(clinicId: string, roomId: string) { const { data, error } = await supabaseServer.from("clinic_rooms").select("id").eq("clinic_id", clinicId).eq("id", roomId).maybeSingle(); if (error) throw error; if (!data) throw new Error("Selected room does not belong to this clinic."); }
  private async insert(table: "doctor_schedules" | "doctor_leave" | "blocked_time" | "doctor_room_assignments" | "clinic_rooms", row: Record<string, unknown>) { const { data, error } = await supabaseServer.from(table).insert(row).select().single(); if (error) throw error; return data; }
  private async update(table: "doctor_schedules" | "doctor_leave" | "blocked_time" | "doctor_room_assignments" | "clinic_rooms", clinicId: string, id: string, row: Record<string, unknown>) { const { data, error } = await supabaseServer.from(table).update(row).eq("clinic_id", clinicId).eq("id", id).select().single(); if (error) throw error; return data; }
}

function scheduleRow(input: ScheduleInput) { return { weekday: input.weekday, start_time: input.startTime, end_time: input.endTime, break_start_time: input.breakStartTime || null, break_end_time: input.breakEndTime || null, effective_from: input.effectiveFrom || null, effective_to: input.effectiveTo || null, timezone: input.timezone }; }
