"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Stethoscope,
  Presentation,
  Clock3,
} from "lucide-react";

import LiveBadge from "./LiveBadge";
import { demoClinic } from "./data";

export default function ExecutiveHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Decorative gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />

      <div className="p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                PatientPilot AI Enterprise
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                Demo Center
              </h1>

              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Experience how PatientPilot AI answers every call, books
                appointments automatically, and helps dental practices recover
                lost revenue.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <Building2 className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Clinic
                  </p>

                  <p className="font-semibold text-slate-900">
                    {demoClinic.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Location
                  </p>

                  <p className="font-semibold text-slate-900">
                    {demoClinic.city}, {demoClinic.state}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <Stethoscope className="h-5 w-5 text-violet-600" />

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Lead Dentist
                  </p>

                  <p className="font-semibold text-slate-900">
                    {demoClinic.doctor}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <LiveBadge />

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 text-slate-500" />

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Last Updated
                </p>

                <p className="font-semibold text-slate-900">
                  Just now
                </p>
              </div>
            </div>

            <button
              className="
                flex items-center justify-center gap-2
                rounded-2xl
                bg-blue-600
                px-5
                py-3
                font-semibold
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-blue-700
                hover:shadow-lg
              "
            >
              <Presentation className="h-5 w-5" />
              Presentation Mode
            </button>

            <p className="text-sm leading-6 text-slate-500">
              Optimized for live demonstrations with dental practice owners.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}