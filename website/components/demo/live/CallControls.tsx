"use client";

import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  PhoneOff,
  Presentation,
} from "lucide-react";

import { useDemo } from "./DemoProvider";

export default function CallControls() {
  const {
    state,
    isPlaying,
    startDemo,
    pauseDemo,
    restartDemo,
    completeDemo,
  } = useDemo();

  const isIdle = state === "idle";
  const isCompleted = state === "completed";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Live Demo Controls
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            AI Receptionist Control Center
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Start, pause, replay, or finish the demonstration.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Start */}

          <button
            onClick={startDemo}
            disabled={!isIdle}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              font-semibold
              text-white
              transition-all
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Play className="h-5 w-5" />
            Start Demo
          </button>

          {/* Pause */}

          <button
            onClick={pauseDemo}
            disabled={!isPlaying}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              font-medium
              text-slate-700
              transition-all
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Pause className="h-5 w-5" />
            Pause
          </button>

          {/* Replay */}

          <button
            onClick={restartDemo}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              font-medium
              text-slate-700
              transition-all
              hover:bg-slate-50
            "
          >
            <RotateCcw className="h-5 w-5" />
            Replay
          </button>

          {/* End */}

          <button
            onClick={completeDemo}
            disabled={isCompleted}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-5
              py-3
              font-medium
              text-red-700
              transition-all
              hover:bg-red-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <PhoneOff className="h-5 w-5" />
            End Call
          </button>

          {/* Presentation */}

          <button
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-slate-100
              px-5
              py-3
              font-medium
              text-slate-700
              transition-all
              hover:bg-slate-200
            "
          >
            <Presentation className="h-5 w-5" />
            Presentation Mode
          </button>
        </div>
      </div>

      {/* Status */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Current Status
            </p>

            <h3 className="mt-1 text-xl font-semibold capitalize text-slate-900">
              {state.replace("_", " ")}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                isPlaying
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-slate-400"
              }`}
            />

            <span className="text-sm font-medium text-slate-600">
              {isPlaying
                ? "Demo Running"
                : "Demo Stopped"}
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}