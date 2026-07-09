import Link from "next/link";

interface Lead {
  id: string;
  clinic_name: string;
  dentist_name: string;
  email: string;
  phone: string;
  monthly_calls: number;
  status: string;
  created_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

export default function LeadsTable({
  leads,
}: LeadsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Recent Leads
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Dental practices requesting a PatientPilot AI demo.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Clinic</th>
              <th className="p-4 text-left">Dentist</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Monthly Calls</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-12 text-center text-slate-500"
                >
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b transition hover:bg-slate-50"
                >
                  <td className="p-4 font-semibold">
                    {lead.clinic_name}
                  </td>

                  <td className="p-4">
                    {lead.dentist_name}
                  </td>

                  <td className="p-4">
                    {lead.email}
                  </td>

                  <td className="p-4">
                    {lead.phone}
                  </td>

                  <td className="p-4">
                    {lead.monthly_calls}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        lead.status === "New"
                          ? "bg-green-100 text-green-700"
                          : lead.status === "Contacted"
                          ? "bg-yellow-100 text-yellow-700"
                          : lead.status === "Demo Scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : lead.status === "Demo Completed"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(
                      lead.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">

                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700"
                      >
                        View
                      </Link>

                      <button className="rounded-lg bg-amber-500 px-3 py-1 text-sm text-white transition hover:bg-amber-600">
                        Edit
                      </button>

                      <button className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700">
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}