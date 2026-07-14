import type { Appointment } from "@/lib/appointments/types";

interface AppointmentWidgetProps {
  appointments: Appointment[];
}

export default function AppointmentWidget({
  appointments,
}: AppointmentWidgetProps) {
  const recentAppointments =
    appointments.slice(0, 5);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Appointments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest appointments booked through
          PatientPilot AI.
        </p>
      </div>

      {recentAppointments.length === 0 ? (
        <div className="px-6 py-10 text-center text-slate-500">
          No appointments found.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentAppointments.map(
            (appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {appointment.patientName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {appointment.reason}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {appointment.phoneNumber}
                  </p>
                </div>

                <div className="ml-6 text-right">
                  <div className="font-medium text-slate-900">
                    {appointment.appointmentDate}
                  </div>

                  <div className="text-sm text-slate-500">
                    {appointment.appointmentTime}
                  </div>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.status ===
                      "confirmed"
                        ? "bg-emerald-100 text-emerald-700"
                        : appointment.status ===
                          "pending"
                        ? "bg-amber-100 text-amber-700"
                        : appointment.status ===
                          "completed"
                        ? "bg-blue-100 text-blue-700"
                        : appointment.status ===
                          "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}