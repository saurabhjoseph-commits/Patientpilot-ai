import Link from "next/link";
import CRMCard from "./CRMCard";

export default function DashboardQuickActions() {
  return (
    <CRMCard title="Quick Actions">
      <div className="space-y-3">
        <Link
          href="/admin/leads"
          className="block rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
        >
          📋 Manage Leads
        </Link>

        <Link
          href="/admin/appointments"
          className="block rounded-lg bg-green-600 px-5 py-3 text-center font-medium text-white transition hover:bg-green-700"
        >
          📅 Appointments
        </Link>

        <Link
          href="/admin/analytics"
          className="block rounded-lg bg-purple-600 px-5 py-3 text-center font-medium text-white transition hover:bg-purple-700"
        >
          📊 Analytics
        </Link>

        <Link
          href="/admin/call-center"
          className="block rounded-lg bg-orange-600 px-5 py-3 text-center font-medium text-white transition hover:bg-orange-700"
        >
          ☎️ AI Call Center
        </Link>

        <Link
          href="/admin/settings"
          className="block rounded-lg bg-slate-700 px-5 py-3 text-center font-medium text-white transition hover:bg-slate-800"
        >
          ⚙️ Settings
        </Link>
      </div>
    </CRMCard>
  );
}