import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function LeadsPage() {
  const { data: leads, error } = await supabaseServer
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Leads</h1>

        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Leads Management
        </h1>

        <p className="text-gray-500">
          View and manage all incoming leads.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Clinic</th>
              <th className="p-4 text-left">Dentist</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Monthly Calls</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <tr
                  key={lead.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4">{lead.clinic_name}</td>

                  <td className="p-4">{lead.dentist_name}</td>

                  <td className="p-4">{lead.email}</td>

                  <td className="p-4">{lead.phone}</td>

                  <td className="p-4">{lead.monthly_calls}</td>

                  <td className="p-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      {lead.status ?? "New"}
                    </span>
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500"
                >
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}