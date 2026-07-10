"use client";

import { useState } from "react";
import {
  CalendarDays,
  Download,
  RefreshCw,
} from "lucide-react";

const ranges = [
  "Today",
  "7 Days",
  "30 Days",
  "90 Days",
] as const;

export default function DashboardFilters() {
  const [selected, setSelected] = useState<(typeof ranges)[number]>("30 Days");

  const handleRefresh = () => {
    // TODO: Refresh analytics from Supabase
    window.location.reload();
  };

  const handleExport = () => {
    // TODO: Export analytics CSV
    alert("CSV export coming in the next sprint.");
  };

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor AI calls, appointments, revenue, and clinic performance.
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelected(range)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selected === range
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
}