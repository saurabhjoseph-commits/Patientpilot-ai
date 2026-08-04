import { Building2, CheckCircle2, FileClock, Ban } from "lucide-react";

export interface ClinicStatsProps {
  total: number;
  active: number;
  draft: number;
  inactive: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClassName: string;
}

function StatCard({
  title,
  value,
  icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function ClinicStats({
  total,
  active,
  draft,
  inactive,
}: ClinicStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Clinics"
        value={total}
        icon={<Building2 className="h-6 w-6" />}
        iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/20"
      />

      <StatCard
        title="Active"
        value={active}
        icon={<CheckCircle2 className="h-6 w-6" />}
        iconClassName="bg-green-100 text-green-600 dark:bg-green-900/20"
      />

      <StatCard
        title="Draft"
        value={draft}
        icon={<FileClock className="h-6 w-6" />}
        iconClassName="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20"
      />

      <StatCard
        title="Inactive"
        value={inactive}
        icon={<Ban className="h-6 w-6" />}
        iconClassName="bg-red-100 text-red-600 dark:bg-red-900/20"
      />
    </section>
  );
}