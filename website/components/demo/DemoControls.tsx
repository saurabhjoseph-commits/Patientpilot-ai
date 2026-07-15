"use client";

import { motion } from "framer-motion";
import {
  Play,
  RotateCcw,
  MonitorPlay,
  Settings2,
  ArrowRight,
} from "lucide-react";

import SectionHeader from "./SectionHeader";

interface DemoControlsProps {
  onStart?: () => void;
  onRestart?: () => void;
  onPresentation?: () => void;
  onReset?: () => void;
}

export default function DemoControls({
  onStart,
  onRestart,
  onPresentation,
  onReset,
}: DemoControlsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="Demo Controls"
        subtitle="Control the PatientPilot AI demonstration."
      />

      <div className="mt-8 space-y-4">
        <button
          onClick={onStart}
          className="
            group
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            bg-blue-600
            px-6
            py-5
            text-left
            text-white
            transition-all
            duration-200
            hover:-translate-y-1
            hover:bg-blue-700
            hover:shadow-xl
          "
        >
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/15 p-3">
              <Play className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-semibold">
                Start Live Demo
              </h3>

              <p className="text-sm text-blue-100">
                Launch the AI receptionist experience
              </p>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={onRestart}
          className="
            flex
            w-full
            items-center
            gap-4
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            py-4
            transition-all
            hover:border-blue-200
            hover:bg-blue-50
          "
        >
          <RotateCcw className="h-5 w-5 text-slate-600" />

          <div className="text-left">
            <h4 className="font-medium text-slate-900">
              Restart Demo
            </h4>

            <p className="text-sm text-slate-500">
              Replay the complete conversation.
            </p>
          </div>
        </button>

        <button
          onClick={onPresentation}
          className="
            flex
            w-full
            items-center
            gap-4
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            py-4
            transition-all
            hover:border-blue-200
            hover:bg-blue-50
          "
        >
          <MonitorPlay className="h-5 w-5 text-slate-600" />

          <div className="text-left">
            <h4 className="font-medium text-slate-900">
              Presentation Mode
            </h4>

            <p className="text-sm text-slate-500">
              Optimized for Zoom and client meetings.
            </p>
          </div>
        </button>

        <button
          onClick={onReset}
          className="
            flex
            w-full
            items-center
            gap-4
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            py-4
            transition-all
            hover:border-red-200
            hover:bg-red-50
          "
        >
          <Settings2 className="h-5 w-5 text-slate-600" />

          <div className="text-left">
            <h4 className="font-medium text-slate-900">
              Reset Scenario
            </h4>

            <p className="text-sm text-slate-500">
              Reset the dashboard to its initial state.
            </p>
          </div>
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          Next Sprint
        </p>

        <h3 className="mt-2 text-lg font-bold text-slate-900">
          Interactive AI Receptionist
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          The next phase will replace these controls with a fully
          interactive voice demo, live transcript, AI reasoning,
          appointment booking, and CRM automation.
        </p>
      </div>
    </motion.section>
  );
}