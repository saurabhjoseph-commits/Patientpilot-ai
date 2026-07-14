"use client";

interface SessionPanelProps {
  callSid: string;
  state?: string;
  intent?: string;
  loading?: boolean;
}

export default function SessionPanel({
  callSid,
  state = "idle",
  intent = "unknown",
  loading = false,
}: SessionPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Session Information
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Call SID
          </p>

          <p className="mt-1 break-all rounded-md bg-slate-100 px-3 py-2 font-mono text-sm">
            {callSid}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Conversation State
            </p>

            <div className="mt-1 rounded-md bg-blue-50 px-3 py-2 font-medium text-blue-700">
              {state}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Intent
            </p>

            <div className="mt-1 rounded-md bg-green-50 px-3 py-2 font-medium text-green-700">
              {intent}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Workflow Status
          </p>

          <div
            className={`mt-1 rounded-md px-3 py-2 font-medium ${
              loading
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {loading
              ? "Processing AI Workflow..."
              : "Ready"}
          </div>
        </div>
      </div>
    </div>
  );
}