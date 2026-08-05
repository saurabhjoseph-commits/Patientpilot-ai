"use client";

import Link from "next/link";
import {
  Building2,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export interface ClinicTableItem {
  id: string;
  name: string;
  slug: string;
  status: "active" | "draft" | "inactive";
  city?: string;
  state?: string;
  createdAt: string;
}

interface ClinicTableProps {
  clinics: ClinicTableItem[];
}

function StatusBadge({
  status,
}: {
  status: ClinicTableItem["status"];
}) {
  const styles = {
    active:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    draft:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    inactive:
      "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function ClinicTable({
  clinics,
}: ClinicTableProps) {
  if (clinics.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-16 text-center">
        <Building2 className="mx-auto mb-4 h-14 w-14 text-gray-300" />

        <h3 className="text-xl font-semibold">
          No clinics found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Create your first clinic to begin onboarding
          dental practices.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Clinic
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Location
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Created
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {clinics.map((clinic) => (
              <tr
                key={clinic.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <div className="font-medium">
                        {clinic.name}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        /{clinic.slug}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-muted-foreground">
                  {[clinic.city, clinic.state]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </td>

                <td className="px-6 py-5">
                  <StatusBadge
                    status={clinic.status}
                  />
                </td>

                <td className="px-6 py-5 text-sm text-muted-foreground">
                  {new Date(
                    clinic.createdAt,
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/clinics/${clinic.id}`}
                      className="rounded-lg p-2 transition hover:bg-muted"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/admin/clinics/${clinic.id}/edit`}
                      className="rounded-lg p-2 transition hover:bg-muted"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      className="rounded-lg p-2 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}