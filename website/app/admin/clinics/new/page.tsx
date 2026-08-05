import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

import { requireAdminPagePermission } from "@/lib/auth-server";
import { Permissions } from "@/lib/platform/domain/identity";
import NewClinicWizard from "./NewClinicWizard";

export const metadata = {
  title: "Create Clinic | PatientPilot AI",
};

export default async function NewClinicPage() {
  await requireAdminPagePermission(Permissions.ClinicUpdate);

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

      <NewClinicWizard />
    </main>
  );
}
