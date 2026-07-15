// website/app/admin/demo/page.tsx

import type { Metadata } from "next";

import DashboardShell from "@/components/demo/DashboardShell";
import ExecutiveHeader from "@/components/demo/ExecutiveHeader";
import KPIGrid from "@/components/demo/KPIGrid";
import RevenueChart from "@/components/demo/RevenueChart";
import ActivityFeed from "@/components/demo/ActivityFeed";
import PerformancePanel from "@/components/demo/PerformancePanel";
import DemoControls from "@/components/demo/DemoControls";

// Live Demo
import { DemoProvider } from "@/components/demo/live/DemoProvider";
import ScenarioSelector from "@/components/demo/live/ScenarioSelector";
import PhoneFrame from "@/components/demo/live/PhoneFrame";
import CallConsole from "@/components/demo/live/CallConsole";
import CallControls from "@/components/demo/live/CallControls";

export const metadata: Metadata = {
  title: "Demo Center | PatientPilot AI",
  description:
    "Interactive enterprise demonstration for PatientPilot AI.",
};

export default function DemoCenterPage() {
  return (
    <DashboardShell>
      {/* ========================================================= */}
      {/* Executive Dashboard */}
      {/* ========================================================= */}

      <ExecutiveHeader />

      <KPIGrid />

      <section className="grid gap-6 xl:grid-cols-2">
        <RevenueChart />
        <ActivityFeed />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PerformancePanel />
        <DemoControls />
      </section>

      {/* ========================================================= */}
      {/* Live AI Receptionist Demo */}
      {/* ========================================================= */}

      <DemoProvider>
        <section className="mt-8 space-y-8">
          <div className="border-t border-slate-200 pt-8">
            <div className="mb-8">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                Live AI Receptionist
              </span>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                Interactive Patient Call Experience
              </h2>

              <p className="mt-3 max-w-3xl text-lg text-slate-600">
                Experience PatientPilot AI handling a real patient call,
                understanding intent, booking an appointment, and updating
                the CRM automatically.
              </p>
            </div>

            <ScenarioSelector />

            <div className="mt-8 grid gap-8 xl:grid-cols-[380px_1fr]">
              <PhoneFrame />

              <CallConsole />
            </div>

            <div className="mt-8">
              <CallControls />
            </div>
          </div>
        </section>
      </DemoProvider>
    </DashboardShell>
  );
}