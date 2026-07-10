"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DemoLauncher() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 p-8 text-white shadow-xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Experience the AI Receptionist
          </h2>

          <p className="mt-2 max-w-2xl text-blue-100">
            Watch how PatientPilot AI answers patient calls,
            schedules appointments, and recovers missed
            opportunities automatically.
          </p>
        </div>

        <Link
          href="/demo"
          className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-semibold text-blue-700 shadow-lg transition hover:scale-105 hover:bg-slate-100"
        >
          <PlayCircle className="h-6 w-6" />
          Launch Live AI Demo
        </Link>
      </div>
    </motion.div>
  );
}