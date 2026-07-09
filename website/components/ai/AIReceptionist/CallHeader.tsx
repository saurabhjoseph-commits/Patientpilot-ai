"use client";

import { PhoneCall } from "lucide-react";
import Timer from "./Timer";

export default function CallHeader() {
  return (
    <div className="flex items-center justify-between border-b bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-cyan-600 p-3 text-white">
          <PhoneCall size={18} />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            PatientPilot AI
          </h3>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

            <span className="text-xs text-green-600">
              Live Call
            </span>
          </div>
        </div>
      </div>

      <Timer />
    </div>
  );
}