export interface ClinicBookingPolicy {
  readonly minimumBookingNoticeMinutes: number;
  readonly maximumBookingHorizonDays: number;
  readonly slotIntervalMinutes: number;
}

export function bookingPolicyFromPersistence(value: unknown): ClinicBookingPolicy | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const policy = {
    minimumBookingNoticeMinutes: row.minimum_booking_notice_minutes,
    maximumBookingHorizonDays: row.maximum_booking_horizon_days,
    slotIntervalMinutes: row.slot_interval_minutes,
  };
  return isClinicBookingPolicy(policy) ? policy : null;
}

export function validateClinicBookingPolicy(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Complete all booking policy values.";
  const row = value as Record<string, unknown>;
  const minimum = row.minimumBookingNoticeMinutes;
  const horizon = row.maximumBookingHorizonDays;
  const interval = row.slotIntervalMinutes;
  if (!Number.isInteger(minimum) || (minimum as number) < 0 || (minimum as number) > 10080) return "Minimum booking notice must be between 0 and 10080 minutes.";
  if (!Number.isInteger(horizon) || (horizon as number) < 1 || (horizon as number) > 730) return "Maximum booking horizon must be between 1 and 730 days.";
  if (!Number.isInteger(interval) || (interval as number) < 5 || (interval as number) > 240 || (interval as number) % 5 !== 0) return "Slot interval must be a multiple of 5 minutes between 5 and 240.";
  return null;
}

export function bookingPolicyToPersistence(policy: ClinicBookingPolicy) {
  return {
    minimum_booking_notice_minutes: policy.minimumBookingNoticeMinutes,
    maximum_booking_horizon_days: policy.maximumBookingHorizonDays,
    slot_interval_minutes: policy.slotIntervalMinutes,
  };
}

function isClinicBookingPolicy(value: { minimumBookingNoticeMinutes: unknown; maximumBookingHorizonDays: unknown; slotIntervalMinutes: unknown }): value is ClinicBookingPolicy {
  return validateClinicBookingPolicy(value) === null;
}
