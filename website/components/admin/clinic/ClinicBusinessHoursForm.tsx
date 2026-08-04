"use client";

import { Clock } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive";

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

interface ClinicBusinessHoursFormProps {
  value: ClinicBusinessHours;
  onChange: (value: ClinicBusinessHours) => void;
  disabled?: boolean;
}

const days: {
  key: DayOfWeek;
  label: string;
}[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function ClinicBusinessHoursForm({
  value,
  onChange,
  disabled = false,
}: ClinicBusinessHoursFormProps) {
  function updateDay(
    day: DayOfWeek,
    changes: Partial<BusinessDay>,
  ) {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        ...changes,
      },
    });
  }

  return (
    <section className="rounded-xl border bg-background p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Business Hours
          </h2>

          <p className="text-sm text-muted-foreground">
            Configure the clinic's operating schedule. These hours will
            be used by PatientPilot AI for appointment booking,
            scheduling validation, and after-hours call handling.
          </p>
        </div>
      </div>

      <ResponsiveTable className="rounded-xl border">
        <table className="min-w-full">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Day
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Open
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Opening Time
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Closing Time
              </th>
            </tr>
          </thead>

          <tbody>
            {days.map((day) => {
              const schedule = value[day.key];

              return (
                <tr
                  key={day.key}
                  className="border-t"
                >
                  <td className="px-6 py-4 font-medium">
                    {day.label}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      disabled={disabled}
                      onChange={(e) =>
                        updateDay(day.key, {
                          enabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <input
                      type="time"
                      value={schedule.open}
                      disabled={
                        disabled || !schedule.enabled
                      }
                      onChange={(e) =>
                        updateDay(day.key, {
                          open: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <input
                      type="time"
                      value={schedule.close}
                      disabled={
                        disabled || !schedule.enabled
                      }
                      onChange={(e) =>
                        updateDay(day.key, {
                          close: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ResponsiveTable>

      <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
        PatientPilot AI will automatically use these hours when:
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Booking appointments</li>
          <li>Suggesting available time slots</li>
          <li>Handling after-hours calls</li>
          <li>Answering "Are you open?" questions</li>
          <li>Sending appointment reminders</li>
        </ul>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50";
