import { supabaseServer } from "@/lib/supabase-server";

import DashboardOverview from "@/components/admin/DashboardOverview";
import StatsGrid from "@/components/admin/StatsGrid";
import ActivityFeed from "@/components/admin/ActivityFeed";
import QuickActions from "@/components/admin/QuickActions";
import LeadsTable from "@/components/admin/LeadsTable";

export default async function AdminPage() {
  // Fetch Leads
  const { data: contacts, error } = await supabaseServer
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch Appointments
  const { data: appointments } = await supabaseServer
    .from("appointments")
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

  const totalAppointments =
    appointments?.length ?? 0;

  const today = new Date().toDateString();

  const aiCallsToday =
    appointments?.filter(
      (appointment) =>
        new Date(
          appointment.created_at
        ).toDateString() === today
    ).length ?? 0;

  const revenuePotential =
    totalAppointments * 150;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}

        <DashboardOverview
          aiCallsToday={aiCallsToday}
        />

        {/* KPI Cards */}

        <StatsGrid
          totalLeads={totalLeads}
          totalAppointments={totalAppointments}
          aiCallsToday={aiCallsToday}
          revenuePotential={revenuePotential}
        />

        {/* Activity + Quick Actions */}

        <div className="mb-10 grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <ActivityFeed
              contacts={contacts ?? []}
              appointments={appointments ?? []}
            />
          </div>

          <QuickActions />

        </div>

        {/* Leads */}

        <LeadsTable
          leads={contacts ?? []}
        />

      </div>
    </main>
  );
}