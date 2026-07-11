import { supabaseServer } from "@/lib/supabase-server";
import {
  buildDashboardAnalytics,
} from "@/lib/dashboard-analytics";

import DashboardOverview from "@/components/admin/DashboardOverview";
import StatsGrid from "@/components/admin/StatsGrid";
import ActivityFeed from "@/components/admin/ActivityFeed";
import DashboardQuickActions from "@/components/admin/DashboardQuickActions";
import LeadsTable from "@/components/admin/LeadsTable";

import DashboardFilters from "@/components/admin/analytics/DashboardFilters";
import DashboardCharts from "@/components/admin/analytics/DashboardCharts";

import DemoLauncher from "@/components/admin/DemoLauncher";

import CallCenterDashboard from "@/components/call-center/CallCenterDashboard";

export default async function AdminPage() {
  const { data: contacts, error } =
    await supabaseServer
      .from("contacts")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  const { data: appointments } =
    await supabaseServer
      .from("appointments")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-red-600">
            Error Loading Dashboard
          </h1>

          <p className="mt-4">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const analytics =
    buildDashboardAnalytics(
      contacts ?? [],
      appointments ?? []
    );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardFilters />

        <DemoLauncher />

        <DashboardOverview
          aiCallsToday={
            analytics.aiCallsToday
          }
        />

        <StatsGrid
          totalLeads={
            analytics.totalLeads
          }
          totalAppointments={
            analytics.totalAppointments
          }
          aiCallsToday={
            analytics.aiCallsToday
          }
          revenuePotential={
            analytics.revenuePotential
          }
        />

        <DashboardCharts
          analytics={analytics}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed
              contacts={contacts ?? []}
              appointments={
                appointments ?? []
              }
            />
          </div>

          <DashboardQuickActions />
        </div>

        <LeadsTable
          leads={contacts ?? []}
        />

        <section className="pt-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              AI Call Center
            </h2>

            <p className="mt-2 text-slate-600">
              Monitor live patient calls,
              AI conversations,
              appointment booking,
              and call transcripts.
            </p>
          </div>

          <CallCenterDashboard />
        </section>
      </div>
    </main>
  );
}