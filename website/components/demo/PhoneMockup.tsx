"use client";

import { ReactNode } from "react";
import { Phone, Wifi, BatteryFull } from "lucide-react";

interface PhoneMockupProps {
  children: ReactNode;
}

export default function PhoneMockup({
  children,
}: PhoneMockupProps) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-slate-900" />

        {/* Screen */}
        <div className="overflow-hidden rounded-[2rem] bg-slate-50">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b bg-white px-5 py-3 text-xs font-medium text-slate-700">
            <span>9:41</span>

            <div className="flex items-center gap-2">
              <Wifi size={14} />
              <BatteryFull size={14} />
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b bg-cyan-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/20 p-2">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  PatientPilot AI
                </p>

                <p className="text-xs text-cyan-100">
                  Live AI Receptionist
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-xs">Live</span>
            </div>
          </div>

          {/* Conversation */}
          <div className="h-[500px] overflow-y-auto bg-gradient-to-b from-slate-100 to-white p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}