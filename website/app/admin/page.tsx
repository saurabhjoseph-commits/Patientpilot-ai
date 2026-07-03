import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function AdminPage() {
  const { data: contacts, error } = await supabaseServer
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-red-600">
            Error Loading Dashboard
          </h1>
          <p className="mt-4">{error.message}</p>
        </div>
      </main>
    );
  }

  const totalLeads = contacts?.length ?? 0;
  const newLeads =
    contacts?.filter((lead) => lead.status === "New").length ?? 0;
  const contacted =
    contacts?.filter((lead) => lead.status === "Contacted").length ?? 0;
  const demoScheduled =
    contacts?.filter((lead) => lead.status === "Demo Scheduled").length ?? 0;

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            PatientPilot AI Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Manage incoming dental clinic leads.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Leads</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              {totalLeads}
            </h2>
          </div>

          <div className="rounded-xl bg-green-50 p-6 shadow">
            <p className="text-sm text-green-700">New Leads</p>
            <h2 className="mt-2 text-4xl font-bold text-green-700">
              {newLeads}
            </h2>
          </div>

          <div className="rounded-xl bg-yellow-50 p-6 shadow">
            <p className="text-sm text-yellow-700">Contacted</p>
            <h2 className="mt-2 text-4xl font-bold text-yellow-700">
              {contacted}
            </h2>
          </div>

          <div className="rounded-xl bg-blue-50 p-6 shadow">
            <p className="text-sm text-blue-700">Demo Scheduled</p>
            <h2 className="mt-2 text-4xl font-bold text-blue-700">
              {demoScheduled}
            </h2>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
          <table className="w-full">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4 text-left">Clinic</th>
                <th className="p-4 text-left">Dentist</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Calls</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {contacts && contacts.length > 0 ? (
                contacts.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">
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
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                        >
                          View
                        </Link>

                        <button className="rounded-lg bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600">
                          Edit
                        </button>

                        <button className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-10 text-center text-gray-500"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}