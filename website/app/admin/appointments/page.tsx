import { supabaseServer } from "@/lib/supabase-server";

export default async function AppointmentsPage() {
  const { data: appointments } = await supabaseServer
    .from("appointments")
    .select("*")
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

      <div className="overflow-hidden rounded-2xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">
                Patient
              </th>

              <th className="p-4 text-left">
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
                <td className="p-4">
                  {appointment.patient_name}
                </td>

                <td className="p-4">
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

        {appointments?.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            No appointments yet.
          </div>
        )}
      </div>
    </main>
  );
}