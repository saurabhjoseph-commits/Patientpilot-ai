export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface BusinessDay {
  enabled: boolean;
  open: string;
  close: string;
}

export type ClinicBusinessHours = Record<
  DayOfWeek,
  BusinessDay
>;

export const BUSINESS_HOUR_DAYS: readonly DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DEFAULT_BUSINESS_DAY: BusinessDay = {
  enabled: true,
  open: "09:00",
  close: "17:00",
};

export const CLOSED_BUSINESS_DAY: BusinessDay = {
  enabled: false,
  open: "",
  close: "",
};

export const DEFAULT_CLINIC_BUSINESS_HOURS: ClinicBusinessHours = {
  monday: {
    ...DEFAULT_BUSINESS_DAY,
  },
  tuesday: {
    ...DEFAULT_BUSINESS_DAY,
  },
  wednesday: {
    ...DEFAULT_BUSINESS_DAY,
  },
  thursday: {
    ...DEFAULT_BUSINESS_DAY,
  },
  friday: {
    ...DEFAULT_BUSINESS_DAY,
  },
  saturday: {
    ...CLOSED_BUSINESS_DAY,
  },
  sunday: {
    ...CLOSED_BUSINESS_DAY,
  },
};

export function isBusinessDayOpen(
  day: BusinessDay,
): boolean {
  return day.enabled;
}

export function getBusinessHours(
  hours: ClinicBusinessHours,
  day: DayOfWeek,
): BusinessDay {
  return hours[day];
}

export function updateBusinessDay(
  hours: ClinicBusinessHours,
  day: DayOfWeek,
  changes: Partial<BusinessDay>,
): ClinicBusinessHours {
  return {
    ...hours,
    [day]: {
      ...hours[day],
      ...changes,
    },
  };
}

export function isBusinessHoursComplete(
  hours: ClinicBusinessHours,
): boolean {
  return Object.values(hours).every((day) => {
    if (!day.enabled) {
      return true;
    }

    return (
      day.open.trim().length > 0 &&
      day.close.trim().length > 0
    );
  });
}

/** Converts stored JSONB safely into the supported clinic-hours contract. */
export function normalizeClinicBusinessHours(
  value: unknown,
): ClinicBusinessHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return cloneDefaultBusinessHours();
  }

  const source = value as Record<string, unknown>;
  return Object.fromEntries(BUSINESS_HOUR_DAYS.map((day) => {
    const candidate = source[day];
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      return [day, { ...DEFAULT_CLINIC_BUSINESS_HOURS[day] }];
    }
    const record = candidate as Record<string, unknown>;
    return [day, {
      enabled: record.enabled === true,
      open: typeof record.open === "string" ? record.open : "",
      close: typeof record.close === "string" ? record.close : "",
    }];
  })) as ClinicBusinessHours;
}

export function validateClinicBusinessHours(
  hours: ClinicBusinessHours,
): string | null {
  for (const day of BUSINESS_HOUR_DAYS) {
    const schedule = hours[day];
    if (!schedule.enabled) continue;
    if (!/^\d{2}:\d{2}$/.test(schedule.open) || !/^\d{2}:\d{2}$/.test(schedule.close) || schedule.open >= schedule.close) {
      return `Opening time must be before closing time on ${day}.`;
    }
  }
  return null;
}

export function cloneDefaultBusinessHours(): ClinicBusinessHours {
  return Object.fromEntries(BUSINESS_HOUR_DAYS.map((day) => [
    day,
    { ...DEFAULT_CLINIC_BUSINESS_HOURS[day] },
  ])) as ClinicBusinessHours;
}
