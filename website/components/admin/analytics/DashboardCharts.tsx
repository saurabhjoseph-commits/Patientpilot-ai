"use client";

import type { DashboardAnalytics } from "@/lib/dashboard-analytics";

interface DashboardChartsProps {
  analytics: DashboardAnalytics;
}

export default function DashboardCharts({
  analytics,
}: DashboardChartsProps) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-bold">Dashboard Charts</h2>

      <p>Total Leads: {analytics.totalLeads}</p>

      <p>Total Appointments: {analytics.totalAppointments}</p>

      <p>
        Revenue Potential: $
        {analytics.revenuePotential.toLocaleString()}
      </p>
    </div>
  );
}