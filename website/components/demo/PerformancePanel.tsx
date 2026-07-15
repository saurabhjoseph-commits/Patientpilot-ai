"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Mic,
  CalendarCheck2,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import SectionHeader from "./SectionHeader";
import { aiPerformance } from "./data";

interface PerformanceMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  progress: number;
  color: string;
}

function PerformanceMetric({
  icon,
  label,
  value,
  progress,
  color,
}: PerformanceMetricProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            {icon}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              {label}
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {value}
            </p>
          </div>
        </div>

        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </motion.div>
  );
}

export default function PerformancePanel() {
  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="AI Performance"
        subtitle="Real-time system health and operational accuracy."
        icon={<Brain className="h-6 w-6 text-violet-600" />}
      />

      <div className="mt-8 grid gap-4">
        <PerformanceMetric
          icon={<Brain className="h-5 w-5 text-violet-600" />}
          label="Intent Detection"
          value={`${aiPerformance.intentDetection}%`}
          progress={aiPerformance.intentDetection}
          color="bg-violet-500"
        />

        <PerformanceMetric
          icon={<Mic className="h-5 w-5 text-blue-600" />}
          label="Speech Recognition"
          value={`${aiPerformance.speechRecognition}%`}
          progress={aiPerformance.speechRecognition}
          color="bg-blue-500"
        />

        <PerformanceMetric
          icon={<CalendarCheck2 className="h-5 w-5 text-emerald-600" />}
          label="Booking Accuracy"
          value={`${aiPerformance.bookingAccuracy}%`}
          progress={aiPerformance.bookingAccuracy}
          color="bg-emerald-500"
        />

        <PerformanceMetric
          icon={<Clock3 className="h-5 w-5 text-amber-600" />}
          label="Average Call Duration"
          value={aiPerformance.averageCallDuration}
          progress={88}
          color="bg-amber-500"
        />
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-100">
              Overall AI Health
            </p>

            <h3 className="mt-1 text-3xl font-bold">
              Excellent
            </h3>

            <p className="mt-2 text-sm text-emerald-100">
              All systems are operating normally and delivering
              enterprise-grade performance.
            </p>
          </div>

          <div className="text-5xl font-bold">
            98%
          </div>
        </div>
      </div>
    </motion.section>
  );
}