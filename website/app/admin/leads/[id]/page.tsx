import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

interface LeadPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailsPage({
  params,
}: LeadPageProps) {
  const { id } = await params;

  const { data: lead, error } = await supabaseServer
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <Link
          href="/admin"
          className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        >
          ← Back to Dashboard
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <h1 className="mb-8 text-4xl font-bold">
            Lead Details
          </h1>

          {/* Clinic Information */}
          <div className="mb-8">
            <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Clinic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">Clinic Name</p>
                <p className="text-lg font-semibold">
                  {lead.clinic_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Dentist Name</p>
                <p className="text-lg font-semibold">
                  {lead.dentist_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg">
                  {lead.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg">
                  {lead.phone}
                </p>
              </div>

            </div>
          </div>

          {/* Business Information */}
          <div className="mb-8">
            <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Business Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Monthly Calls
                </p>
                <p className="text-lg font-semibold">
                  {lead.monthly_calls}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
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
              </div>

            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Message
            </h2>

            <div className="rounded-lg bg-slate-50 p-5">
              {lead.message ? (
                <p>{lead.message}</p>
              ) : (
                <p className="italic text-gray-500">
                  No message provided.
                </p>
              )}
            </div>
          </div>

          {/* Created */}
          <div>
            <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Lead Information
            </h2>

            <p className="text-gray-600">
              <strong>Created:</strong>{" "}
              {new Date(lead.created_at).toLocaleString()}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}