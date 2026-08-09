export function validateSchedule(input: { weekday: number; startTime: string; endTime: string; breakStartTime?: string; breakEndTime?: string; effectiveFrom?: string; effectiveTo?: string }): string | null {
  if (!Number.isInteger(input.weekday) || input.weekday < 0 || input.weekday > 6) return "Select a valid weekday.";
  if (!/^\d{2}:\d{2}$/.test(input.startTime) || !/^\d{2}:\d{2}$/.test(input.endTime) || input.startTime >= input.endTime) return "Schedule start time must be before end time.";
  if (input.effectiveFrom && input.effectiveTo && input.effectiveFrom > input.effectiveTo) return "Effective start date must be before end date.";
  if ((input.breakStartTime || input.breakEndTime) && (!input.breakStartTime || !input.breakEndTime || input.startTime >= input.breakStartTime || input.breakStartTime >= input.breakEndTime || input.breakEndTime >= input.endTime)) return "Schedule breaks must be within working hours.";
  return null;
}
export function validateLeave(input: { startsOn: string; endsOn: string }): string | null { return !input.startsOn || !input.endsOn || input.startsOn > input.endsOn ? "Leave end date must be on or after the start date." : null; }
export function validateBlock(input: { startsAt: string; endsAt: string }): string | null { return !input.startsAt || !input.endsAt || new Date(input.startsAt) >= new Date(input.endsAt) ? "Blocked time must end after it starts." : null; }
export function validateRoomAssignment(input: { roomId: string; effectiveFrom?: string; effectiveTo?: string }): string | null { return !input.roomId ? "Select a room." : input.effectiveFrom && input.effectiveTo && input.effectiveFrom > input.effectiveTo ? "Assignment end date must be on or after the start date." : null; }
export function overlaps(startA: string, endA: string, startB: string, endB: string): boolean { return startA < endB && startB < endA; }
