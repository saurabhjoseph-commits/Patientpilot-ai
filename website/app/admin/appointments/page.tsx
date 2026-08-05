import { supabaseServer } from "@/lib/supabase-server";
import { ResponsiveTable } from "@/components/ui/responsive";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { Permissions } from "@/lib/platform/domain/identity";

export default async function AppointmentsPage() {
  const identity = await requireAdminPagePermission(Permissions.AppointmentsRead);
  const { data: appointments } = await supabaseServer
    .from("appointments")
    .select("*")
    .eq("clinic_id", identity.clinicId)
    .order("created_at", { ascending: false });

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Appointments
        </h1>

        <p className="mt-2 text-slate-500">
          AI Receptionist bookings
        </p>
      </div>

      <div className="rounded-2xl border bg-white shadow">
        <ResponsiveTable>
        <table className="min-w-[640px] w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="hidden p-4 text-left sm:table-cell">
                Patient
              </th>

              <th className="hidden p-4 text-left md:table-cell">
                Phone
              </th>

              <th className="p-4 text-left">
                Service
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Time
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {appointments?.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b"
              >
                <td className="hidden p-4 sm:table-cell">
                  {appointment.patient_name}
                </td>

                <td className="hidden p-4 md:table-cell">
                  {appointment.phone}
                </td>

                <td className="p-4">
                  {appointment.service}
                </td>

                <td className="p-4">
                  {appointment.appointment_date}
                </td>

                <td className="p-4">
                  {appointment.appointment_time}
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    Confirmed
                  </span>
                </td>

                <td className="p-4">
                  {new Date(
                    appointment.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </ResponsiveTable>

        {appointments?.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            No appointments yet.
          </div>
        )}
      </div>
    </main>
  );
}
