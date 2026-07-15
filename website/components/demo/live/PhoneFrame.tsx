"use client";

import { motion } from "framer-motion";
import {
  BatteryFull,
  Signal,
  Wifi,
  PhoneIncoming,
  PhoneCall,
  PhoneOff,
  Bot,
} from "lucide-react";

import LiveBadge from "@/components/demo/LiveBadge";

import { useDemo } from "./DemoProvider";
import { formatElapsedTime } from "./timer";

export default function PhoneFrame() {
  const {
    scenario,
    stage,
    elapsedSeconds,
    isCompleted,
    isPlaying,
  } = useDemo();

  const isIncoming =
    stage === "idle" ||
    stage === "ringing";

  const isConnected =
    stage === "connected" ||
    stage === "conversation" ||
    stage === "thinking" ||
    stage === "booking" ||
    stage === "crm_update";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex justify-center"
    >
      <div
        className="
          relative
          h-[720px]
          w-[360px]
          overflow-hidden
          rounded-[42px]
          border-[10px]
          border-slate-900
          bg-gradient-to-b
          from-slate-900
          via-slate-800
          to-slate-950
          shadow-2xl
        "
      >
        {/* Status Bar */}

        <div className="flex items-center justify-between px-6 pt-4 text-xs text-white">
          <span>10:01</span>

          <div className="flex items-center gap-2">
            <Signal className="h-4 w-4" />
            <Wifi className="h-4 w-4" />
            <BatteryFull className="h-4 w-4" />
          </div>
        </div>

        {/* Dynamic Island */}

        <div className="mx-auto mt-3 h-8 w-36 rounded-full bg-black" />

        {/* Content */}

        <div className="flex h-full flex-col items-center px-8 pt-12 text-center text-white">

          {/* Avatar */}

          <motion.div
            animate={
              isPlaying
                ? {
                    scale: [1, 1.05, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              flex
              h-32
              w-32
              items-center
              justify-center
              rounded-full
              bg-blue-600
              shadow-xl
            "
          >
            <Bot className="h-14 w-14" />
          </motion.div>

          <h2 className="mt-8 text-3xl font-bold">
            PatientPilot AI
          </h2>

          <p className="mt-2 text-slate-300">
            Bright Smile Dental
          </p>

          <div className="mt-12">
            <p className="text-2xl font-semibold">
              {scenario.patientName}
            </p>

            <p className="mt-2 text-slate-300">
              {scenario.callerPhone}
            </p>
          </div>

          {/* Call State */}

          <div className="mt-8">

            {isIncoming && (
              <motion.div
                animate={{
                  opacity: [1, 0.4, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
                className="inline-flex items-center gap-3 rounded-full bg-emerald-500/20 px-5 py-3"
              >
                <PhoneIncoming className="h-5 w-5 text-emerald-400" />

                <span className="font-medium">
                  Incoming Call
                </span>
              </motion.div>
            )}

            {isConnected && (
              <div className="flex flex-col items-center gap-5">

                <LiveBadge />

                <div className="rounded-full bg-white/10 px-5 py-2 text-lg font-semibold">
                  {formatElapsedTime(elapsedSeconds)}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-5 py-2">

                  <PhoneCall className="h-5 w-5 text-blue-300" />

                  <span>
                    {
                      stage.charAt(0).toUpperCase() +
                      stage.slice(1).replace("_", " ")
                    }
                  </span>

                </div>

              </div>
            )}

            {isCompleted && (
              <div className="flex flex-col items-center gap-5">

                <PhoneOff className="h-6 w-6 text-red-400" />

                <p className="font-semibold">
                  Call Completed
                </p>

              </div>
            )}

          </div>

          {/* Footer */}

          <div className="mt-auto mb-16">

            <div className="rounded-full bg-white/10 px-6 py-3 text-sm text-slate-300">

              AI Receptionist Active

            </div>

          </div>

        </div>
      </div>
    </motion.section>
  );
}