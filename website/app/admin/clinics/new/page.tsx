import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export const metadata = {
  title: "Create Clinic | PatientPilot AI",
};

export default function NewClinicPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8">
      {/* Back Navigation */}
      <div>
        <Link
          href="/admin/clinics"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clinics
        </Link>
      </div>

      {/* Page Header */}
      <section className="rounded-xl border bg-background p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Clinic
            </h1>

            <p className="mt-2 text-muted-foreground">
              Add a new dental clinic and prepare it for onboarding into
              the PatientPilot AI platform.
            </p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-xl border bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Step 1 of 6
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Basic Clinic Information
            </h2>
          </div>

          <div className="text-sm text-muted-foreground">
            17% Complete
          </div>
        </div>

        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/6 rounded-full bg-blue-600" />
        </div>
      </section>

      {/* Form Placeholder */}
      <section className="rounded-xl border bg-background p-8">
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <Building2 className="mb-4 h-14 w-14 text-gray-300" />

          <h3 className="text-2xl font-semibold">
            Clinic Onboarding Wizard
          </h3>

          <p className="mt-3 max-w-xl text-muted-foreground">
            This page will guide administrators through creating a clinic,
            configuring business information, AI settings, staff,
            integrations, and activating the clinic for production.
          </p>
        </div>
      </section>
    </main>
  );
}