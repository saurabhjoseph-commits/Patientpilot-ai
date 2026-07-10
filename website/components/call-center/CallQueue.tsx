"use client";

import {
  PhoneIncoming,
  Clock3,
  User,
  Phone,
} from "lucide-react";

interface Call {
  id: string;
  patient_name: string | null;
  phone: string;
  status: string;
  started_at: string | null;
}

interface CallQueueProps {
  calls: Call[];
}

export default function CallQueue({
  calls,
}: CallQueueProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Calls
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest AI call activity
            </p>
          </div>

          <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            {calls.length} Calls
          </div>
        </div>
      </div>

      {/* Calls */}
      <div className="divide-y divide-slate-100">
        {calls.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No recent calls.
          </div>
        ) : (
          calls.map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between p-5 hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3">
                  <PhoneIncoming className="h-5 w-5 text-blue-600" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />

                    <p className="font-semibold text-slate-900">
                      {call.patient_name ?? "Unknown Patient"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="h-4 w-4" />

                    {call.phone}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4" />

                  {call.started_at
                    ? new Date(
                        call.started_at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}
                </div>

                <div
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    call.status === "ringing"
                      ? "bg-yellow-100 text-yellow-700"
                      : call.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : call.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {call.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}