import { supabaseServer } from "@/lib/supabase-server";
import {
  buildDashboardAnalytics,
} from "@/lib/dashboard-analytics";

import DashboardFilters from "@/components/admin/analytics/DashboardFilters";
import DashboardCharts from "@/components/admin/analytics/DashboardCharts";

import {
  TrendingUp,
  Users,
  CalendarDays,
  Phone,
  DollarSign,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const { data: contacts } =
    await supabaseServer
      .from("contacts")
      .select("*");

  const { data: appointments } =
    await supabaseServer
      .from("appointments")
      .select("*");

  const analytics =
    buildDashboardAnalytics(
      contacts ?? [],
      appointments ?? []
    );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Analytics
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Business Analytics
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor AI performance,
            appointments,
            revenue opportunities,
            and patient growth.
          </p>
        </div>

        {/* Filters */}

        <DashboardFilters />

        {/* KPI Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Revenue Potential"
            value={`$${analytics.revenuePotential.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            color="bg-green-100 text-green-700"
          />

          <MetricCard
            title="Total Leads"
            value={analytics.totalLeads}
            icon={<Users className="h-6 w-6" />}
            color="bg-blue-100 text-blue-700"
          />

          <MetricCard
            title="Appointments"
            value={analytics.totalAppointments}
            icon={<CalendarDays className="h-6 w-6" />}
            color="bg-purple-100 text-purple-700"
          />

          <MetricCard
            title="AI Calls Today"
            value={analytics.aiCallsToday}
            icon={<Phone className="h-6 w-6" />}
            color="bg-amber-100 text-amber-700"
          />
        </div>

        {/* Charts */}

        <DashboardCharts
          analytics={analytics}
        />

        {/* Insights */}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-green-600" />

              <h2 className="text-xl font-semibold">
                AI Performance
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <Insight
                label="Revenue Opportunity"
                value={`$${analytics.revenuePotential.toLocaleString()}`}
              />

              <Insight
                label="Appointments"
                value={analytics.totalAppointments}
              />

              <Insight
                label="AI Calls Today"
                value={analytics.aiCallsToday}
              />

              <Insight
                label="Lead Conversion"
                value={`${analytics.totalLeads === 0
                  ? 0
                  : Math.round(
                      (analytics.totalAppointments /
                        analytics.totalLeads) *
                        100
                    )}%`}
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">
              Lead Sources
            </h2>

            <div className="space-y-3">
              {analytics.leadSources.length ===
              0 ? (
                <p className="text-sm text-slate-500">
                  No lead source data yet.
                </p>
              ) : (
                analytics.leadSources.map(
                  (source) => (
                    <div
                      key={source.name}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                    >
                      <span>
                        {source.name}
                      </span>

                      <span className="font-semibold">
                        {source.value}
                      </span>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: MetricCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
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

function Insight({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <span className="text-slate-600">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}