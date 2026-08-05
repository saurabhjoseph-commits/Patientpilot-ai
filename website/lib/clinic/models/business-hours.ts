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