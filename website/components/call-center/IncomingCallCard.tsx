"use client";

import {
  PhoneIncoming,
  Phone,
  User,
  Clock3,
} from "lucide-react";

interface IncomingCall {
  id: string;
  patient_name: string | null;
  phone: string;
  status: string;
  started_at: string | null;
}

interface IncomingCallCardProps {
  call?: IncomingCall | null;
}

export default function IncomingCallCard({
  call,
}: IncomingCallCardProps) {
  if (!call) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <PhoneIncoming className="mx-auto mb-4 h-12 w-12 text-slate-300" />

          <h2 className="text-xl font-bold text-slate-700">
            No Incoming Calls
          </h2>

          <p className="mt-2 text-slate-500">
            Waiting for the next patient...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-300 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Incoming Call
            </h2>

            <p className="text-amber-100">
              New patient calling
            </p>
          </div>

          <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            Ringing
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Patient
            </p>

            <p className="font-semibold">
              {call.patient_name ??
                "Unknown Patient"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Phone
            </p>

            <p>{call.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Started
            </p>

            <p>
              {call.started_at
                ? new Date(
                    call.started_at
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--"}
            </p>
          </div>
        </div>

        <button className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700">
          Accept Call
        </button>
      </div>
    </div>
  );
}