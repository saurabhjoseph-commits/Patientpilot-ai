import Link from "next/link";

import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Phone,
  Calendar,
} from "lucide-react";

import { listPatientsService } from "@/lib/patients/service";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  const patients = await listPatientsService();

  const totalPatients = patients.length;

  const activePatients = patients.filter(
    (patient) => patient.status === "active"
  ).length;

  const newPatients = patients.filter(
    (patient) => patient.status === "new"
  ).length;

  const inactivePatients = patients.filter(
    (patient) => patient.status === "inactive"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            Patient CRM
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Patients
          </h1>

          <p className="mt-2 text-slate-600">
            Manage every patient captured by
            PatientPilot AI.
          </p>
        </div>

        <Link
          href="/admin/test-console"
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Simulate AI Call
        </Link>
      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Active"
          value={activePatients}
          icon={<UserCheck className="h-6 w-6" />}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="New"
          value={newPatients}
          icon={<UserPlus className="h-6 w-6" />}
          color="bg-amber-100 text-amber-600"
        />

        <StatCard
          title="Inactive"
          value={inactivePatients}
          icon={<UserX className="h-6 w-6" />}
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold">
            Patient Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live patient records stored in
            Supabase.
          </p>
        </div>

        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="mb-4 h-12 w-12 text-slate-300" />

            <h3 className="text-lg font-semibold text-slate-700">
              No Patients Yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Patients will automatically appear
              here after AI conversations create
              appointments.
            </p>

            <Link
              href="/admin/test-console"
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              Open Developer Console
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-600">
                  <th className="px-6 py-4">
                    Patient
                  </th>

                  <th className="px-6 py-4">
                    Contact
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Appointments
                  </th>

                  <th className="px-6 py-4">
                    Last Visit
                  </th>

                  <th className="px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-t"
                  >
                    <td className="px-6 py-5">
                      <div className="font-medium">
                        {patient.fullName}
                      </div>

                      <div className="text-sm text-slate-500">
                        {patient.clinicName}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />

                        {patient.phoneNumber}
                      </div>

                      {patient.email && (
                        <div className="mt-2 text-slate-500">
                          {patient.email}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={patient.status}
                      />
                    </td>

                    <td className="px-6 py-5">
                      {patient.totalAppointments}
                    </td>

                    <td className="px-6 py-5">
                      {patient.lastAppointmentDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />

                          {new Date(
                            patient.lastAppointmentDate
                          ).toLocaleDateString()}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <button className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-100">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value}
          </h3>
        </div>

        <div
          className={`rounded-xl p-3 ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    active:
      "bg-green-100 text-green-700",
    new:
      "bg-amber-100 text-amber-700",
    inactive:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ??
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}