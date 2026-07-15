"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Brain,
  CalendarCheck2,
  ShieldCheck,
  Smile,
} from "lucide-react";

import SectionHeader from "@/components/demo/SectionHeader";
import { useDemo } from "./DemoProvider";

function AnalysisCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      layout
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 ${color}`}>
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ConfidenceBar({
  confidence,
}: {
  confidence: number;
}) {
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          AI Confidence
        </span>

        <span className="font-semibold text-slate-900">
          {confidence}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${confidence}%`,
          }}
          transition={{
            duration: 0.5,
          }}
          className="h-full rounded-full bg-emerald-500"
        />
      </div>
    </div>
  );
}

function stageDescription(stage: string) {
  switch (stage) {
    case "ringing":
      return "Waiting for the call to begin.";

    case "connected":
      return "Greeting the patient.";

    case "conversation":
      return "Listening and collecting information.";

    case "thinking":
      return "Analyzing intent and determining the next action.";

    case "booking":
      return "Creating the appointment.";

    case "crm_update":
      return "Updating the practice management system.";

    case "completed":
      return "Call completed successfully.";

    default:
      return "Ready for the next patient.";
  }
}

export default function AIThinkingPanel() {
  const {
    stage,
    progress,
    scenario,
  } = useDemo();

  const analysis = scenario.analysis;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="AI Thinking"
        subtitle="Real-time reasoning performed by PatientPilot AI."
        icon={
          <Brain className="h-6 w-6 text-violet-600" />
        }
      />

      <ConfidenceBar
        confidence={analysis.confidence}
      />

      {/* Current Stage */}

      <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
              Current Stage
            </p>

            <h3 className="mt-1 text-xl font-bold text-violet-900 capitalize">
              {stage.replace("_", " ")}
            </h3>

            <p className="mt-2 text-sm text-violet-700">
              {stageDescription(stage)}
            </p>

          </div>

          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
            {progress}%
          </div>

        </div>
      </div>

      {/* Analysis */}

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <AnalysisCard
          title="Intent"
          value={analysis.intent}
          icon={<Brain className="h-5 w-5" />}
          color="bg-violet-100 text-violet-700"
        />

        <AnalysisCard
          title="Insurance"
          value={analysis.insurance ?? "Pending"}
          icon={<ShieldCheck className="h-5 w-5" />}
          color="bg-blue-100 text-blue-700"
        />

        <AnalysisCard
          title="Procedure"
          value={analysis.procedure ?? "Pending"}
          icon={<CalendarCheck2 className="h-5 w-5" />}
          color="bg-emerald-100 text-emerald-700"
        />

        <AnalysisCard
          title="Urgency"
          value={analysis.urgency}
          icon={<Activity className="h-5 w-5" />}
          color="bg-amber-100 text-amber-700"
        />

        <AnalysisCard
          title="Sentiment"
          value={analysis.sentiment}
          icon={<Smile className="h-5 w-5" />}
          color="bg-pink-100 text-pink-700"
        />

        <AnalysisCard
          title="Next Action"
          value={analysis.nextAction}
          icon={<BadgeCheck className="h-5 w-5" />}
          color="bg-green-100 text-green-700"
        />

      </div>

      {/* AI Summary */}

      <motion.div
        layout
        className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5"
      >
        <h3 className="font-semibold text-blue-900">
          AI Reasoning Summary
        </h3>

        <p className="mt-3 text-sm leading-7 text-blue-800">
          PatientPilot AI continuously evaluates the
          conversation, extracts structured patient
          information, determines clinical intent,
          prioritizes urgency, verifies insurance details,
          and recommends the next workflow action before
          updating the CRM.
        </p>
      </motion.div>
    </motion.section>
  );
}