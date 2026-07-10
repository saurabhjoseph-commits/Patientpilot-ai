"use client";

import { motion } from "framer-motion";
import {
  PhoneCall,
  Clock3,
  User,
  Timer,
  Activity,
  CheckCircle2,
} from "lucide-react";

import type { ActiveCall } from "@/types/call-center";

interface ActiveCallCardProps {
  call: ActiveCall;
}

export default function ActiveCallCard({
  call,
}: ActiveCallCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-6 w-6" />

            <div>
              <h2 className="text-xl font-bold">
                Active Call
              </h2>

              <p className="text-sm text-blue-100">
                AI receptionist is assisting the patient
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
            Live
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
              {call.patientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Connected
            </p>

            <p className="font-semibold">
              {call.connectedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Timer className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Duration
            </p>

            <p className="font-semibold">
              {call.duration}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-emerald-600" />

          <div>
            <p className="text-xs uppercase text-slate-500">
              AI State
            </p>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 capitalize">
              {call.aiState}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-blue-600" />

            <div>
              <h3 className="font-semibold text-blue-700">
                Current Appointment
              </h3>

              <p className="mt-1 text-sm text-blue-600">
                {call.appointmentType}
              </p>

              <p className="text-sm text-blue-600">
                {call.preferredDate}
              </p>

              <p className="text-sm text-blue-600">
                {call.preferredTime}
              </p>

              <p className="text-sm text-blue-600">
                {call.dentist}
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}