import type { CallSummary } from "@/lib/summaries/types";

interface SummaryWidgetProps {
  summaries: CallSummary[];
}

export default function SummaryWidget({
  summaries,
}: SummaryWidgetProps) {
  const recentSummaries = summaries.slice(0, 5);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          AI Call Summaries
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest conversations processed by PatientPilot AI.
        </p>
      </div>

      {recentSummaries.length === 0 ? (
        <div className="px-6 py-10 text-center text-slate-500">
          No call summaries available.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentSummaries.map((summary) => (
            <div
              key={summary.id}
              className="px-6 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {summary.patientName ?? "Unknown Patient"}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {summary.summary}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {summary.intent}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {summary.outcome}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {(summary.confidence * 100).toFixed(0)}%
                  </div>

                  <div className="text-xs text-slate-500">
                    Confidence
                  </div>

                  {summary.durationSeconds && (
                    <div className="mt-2 text-xs text-slate-500">
                      {summary.durationSeconds}s
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}