"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  CalendarDays,
  Phone,
  ShieldCheck,
  User,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import SectionHeader from "@/components/demo/SectionHeader";
import { useDemo } from "./DemoProvider";

function StatusBadge({
  label,
  color,
}: {
  label: string;
  color: "blue" | "green" | "amber" | "slate";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[color]}`}
    >
      {label}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="rounded-xl bg-white p-2 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <div className="mt-1 font-semibold text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}

function stageLabel(stage: string) {
  switch (stage) {
    case "idle":
      return "Waiting";
    case "ringing":
      return "Incoming Call";
    case "connected":
      return "Connected";
    case "conversation":
      return "Listening";
    case "thinking":
      return "AI Reasoning";
    case "booking":
      return "Booking Appointment";
    case "crm_update":
      return "Updating CRM";
    case "completed":
      return "Completed";
    default:
      return "Ready";
  }
}

export default function CallConsole() {
  const {
    scenario,
    stage,
    progress,
  } = useDemo();

  const analysis = scenario.analysis;

  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="Call Console"
        subtitle="Live AI call intelligence"
        icon={<Activity className="h-6 w-6 text-blue-600" />}
      />

      {/* Status */}

      <div className="mt-8 flex flex-wrap gap-3">
        <StatusBadge
          label={stageLabel(stage)}
          color="blue"
        />

        <StatusBadge
          label={`${analysis.confidence}% Confidence`}
          color="green"
        />

        <StatusBadge
          label={analysis.sentiment}
          color="amber"
        />
      </div>

      {/* Progress */}

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Conversation Progress
          </span>

          <span className="font-semibold text-slate-900">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.35,
            }}
            className="h-full rounded-full bg-blue-600"
          />
        </div>
      </div>

      {/* Information */}

      <div className="mt-8 grid gap-4">

        <InfoRow
          icon={<User className="h-5 w-5 text-blue-600" />}
          label="Patient"
          value={scenario.patientName}
        />

        <InfoRow
          icon={<Phone className="h-5 w-5 text-emerald-600" />}
          label="Caller"
          value={scenario.callerPhone}
        />

        <InfoRow
          icon={<Brain className="h-5 w-5 text-violet-600" />}
          label="Detected Intent"
          value={analysis.intent}
        />

        <InfoRow
          icon={<ShieldCheck className="h-5 w-5 text-cyan-600" />}
          label="Insurance"
          value={analysis.insurance ?? "Pending"}
        />

        <InfoRow
          icon={<CalendarDays className="h-5 w-5 text-orange-600" />}
          label="Next Action"
          value={analysis.nextAction}
        />

        <InfoRow
          icon={<Clock3 className="h-5 w-5 text-slate-600" />}
          label="Urgency"
          value={analysis.urgency}
        />

      </div>

      {/* Summary */}

      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

        <div className="flex gap-3">

          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />

          <div>

            <h3 className="font-semibold text-emerald-900">
              AI Decision
            </h3>

            <p className="mt-2 text-sm leading-6 text-emerald-800">
              PatientPilot AI identified the patient's
              intent, verified the available information,
              and is automatically progressing toward the
              next best action.
            </p>

          </div>

        </div>

      </div>
    </motion.section>
  );
}