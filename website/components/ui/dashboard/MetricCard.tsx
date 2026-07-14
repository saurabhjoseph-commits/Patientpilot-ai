import { ReactNode } from "react";
import clsx from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;

  icon?: ReactNode;

  trend?: {
    value: string;
    positive?: boolean;
  };

  footer?: ReactNode;

  className?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  footer,
  className,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        {icon && (
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}

      {trend && (
        <div
          className={clsx(
            "mt-5 flex items-center gap-2 text-sm font-medium",
            trend.positive
              ? "text-green-600"
              : "text-red-600"
          )}
        >
          {trend.positive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}

          <span>{trend.value}</span>
        </div>
      )}

      {/* Footer */}

      {footer && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          {footer}
        </div>
      )}
    </div>
  );
}