"use client";

import Link from "next/link";
import { Building2, Plus } from "lucide-react";

interface ClinicHeaderProps {
  title?: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
}

export default function ClinicHeader({
  title = "Clinics",
  description = "Manage every dental clinic connected to PatientPilot AI.",
  createHref = "/admin/clinics/new",
  createLabel = "New Clinic",
}: ClinicHeaderProps) {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20">
          <Building2 className="h-7 w-7 text-blue-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Link
        href={createHref}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        {createLabel}
      </Link>
    </section>
  );
}