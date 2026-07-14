import type { Patient } from "@/lib/patients/types";

interface PatientWidgetProps {
  patients: Patient[];
}

export default function PatientWidget({
  patients,
}: PatientWidgetProps) {
  const recentPatients = patients.slice(0, 5);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Patients
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest patient records created or updated by
          PatientPilot AI.
        </p>
      </div>

      {recentPatients.length === 0 ? (
        <div className="px-6 py-10 text-center text-slate-500">
          No patients found.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900">
                  {patient.fullName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {patient.phoneNumber}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {patient.clinicName}
                </p>
              </div>

              <div className="ml-6 text-right">
                <div className="text-sm font-medium text-slate-900">
                  {patient.totalAppointments} Appointment
                  {patient.totalAppointments !== 1 ? "s" : ""}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {patient.lastAppointmentDate ??
                    "No appointments"}
                </div>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    patient.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : patient.status === "new"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {patient.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}