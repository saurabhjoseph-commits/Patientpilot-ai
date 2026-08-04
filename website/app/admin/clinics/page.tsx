import Link from "next/link";
import { Building2, Plus } from "lucide-react";

export const metadata = {
  title: "Clinic Management | PatientPilot AI",
};

export default function ClinicsPage() {
  return (
    <main className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Clinics
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage every dental clinic connected to PatientPilot AI.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/clinics/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Clinic
        </Link>
      </section>

      {/* Stats Placeholder */}
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Clinics"
          value="0"
        />

        <StatCard
          title="Active"
          value="0"
        />

        <StatCard
          title="Draft"
          value="0"
        />

        <StatCard
          title="Inactive"
          value="0"
        />
      </section>

      {/* Search / Filters Placeholder */}
      <section className="rounded-xl border bg-background p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            placeholder="Search clinics..."
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 lg:max-w-md"
          />

          <div className="text-sm text-muted-foreground">
            Filters and advanced search will be added in the next step.
          </div>
        </div>
      </section>

      {/* Table Placeholder */}
      <section className="rounded-xl border bg-background">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">
            Clinic Directory
          </h2>
        </div>

        <div className="flex min-h-[320px] flex-col items-center justify-center px-8 py-16 text-center">
          <Building2 className="mb-4 h-14 w-14 text-gray-300" />

          <h3 className="text-xl font-semibold">
            No Clinics Yet
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Create your first clinic to begin onboarding dental
            practices into PatientPilot AI.
          </p>

          <Link
            href="/admin/clinics/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create First Clinic
          </Link>
        </div>
      </section>
    </main>
  );
}

interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}