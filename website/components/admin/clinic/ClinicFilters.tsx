"use client";

export type ClinicStatusFilter =
  | "all"
  | "active"
  | "draft"
  | "inactive";

export type ClinicSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc";

interface ClinicFiltersProps {
  status: ClinicStatusFilter;
  sort: ClinicSortOption;
  onStatusChange: (status: ClinicStatusFilter) => void;
  onSortChange: (sort: ClinicSortOption) => void;
}

export default function ClinicFilters({
  status,
  sort,
  onStatusChange,
  onSortChange,
}: ClinicFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Status
        </label>

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as ClinicStatusFilter)
          }
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Clinics</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Sort By
        </label>

        <select
          value={sort}
          onChange={(e) =>
            onSortChange(e.target.value as ClinicSortOption)
          }
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
        </select>
      </div>
    </div>
  );
}