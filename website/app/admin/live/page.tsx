import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  PhoneCall,
} from "lucide-react";

import LiveMonitor from "@/components/admin/live/LiveMonitor";

export const metadata = {
  title: "Live Conversation Monitor | PatientPilot AI",
  description:
    "Monitor active AI receptionist conversations in real time.",
};

export default function LiveConversationMonitorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Dashboard
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <Activity className="h-4 w-4" />

            Live Monitoring Enabled
          </div>
        </div>

        {/* Page Header */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="rounded-xl bg-blue-100 p-4">
              <PhoneCall className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Live Conversation Monitor
              </h1>

              <p className="mt-2 text-slate-600">
                Watch live PatientPilot AI receptionist calls,
                transcripts, conversation state, and AI activity
                in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Live Monitor */}
        <LiveMonitor />
      </div>
    </div>
  );
}
