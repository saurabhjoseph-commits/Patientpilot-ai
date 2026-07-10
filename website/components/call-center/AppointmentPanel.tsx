"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  User,
  Phone,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";

import type { ActiveCall } from "@/types/call-center";

interface AppointmentPanelProps {
  call: ActiveCall;
}

export default function AppointmentPanel({
  call,
}: AppointmentPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white">
        <h2 className="text-xl font-bold">
          Appointment Assistant
        </h2>

        <p className="mt-1 text-sm text-blue-100">
          AI is automatically collecting booking information.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-5 p-6">

        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Patient
            </p>

            <p className="font-semibold text-slate-900">
              {call.patientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Phone
            </p>

            <p className="font-semibold text-slate-900">
              {call.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Stethoscope className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Appointment Type
            </p>

            <p className="font-semibold text-slate-900">
              {call.appointmentType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Preferred Date
            </p>

            <p className="font-semibold text-slate-900">
              {call.preferredDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Preferred Time
            </p>

            <p className="font-semibold text-slate-900">
              {call.preferredTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-blue-600" />

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Dentist
            </p>

            <p className="font-semibold text-slate-900">
              {call.dentist}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />

            <div>
              <h3 className="font-semibold text-emerald-700">
                Appointment Ready
              </h3>

              <p className="mt-1 text-sm text-emerald-600">
                AI has collected all required information and is
                ready to confirm the appointment.
              </p>
            </div>
          </div>
        </div>

        <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
          Confirm Appointment
        </button>

      </div>
    </motion.div>
  );
}