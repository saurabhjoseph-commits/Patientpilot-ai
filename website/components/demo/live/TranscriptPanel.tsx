"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Bot,
  User,
  Clock3,
} from "lucide-react";
import clsx from "clsx";

import SectionHeader from "@/components/demo/SectionHeader";
import { useDemo } from "./DemoProvider";

export default function TranscriptPanel() {
  const {
    visibleMessages,
    progress,
  } = useDemo();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}

      <div className="border-b border-slate-200 p-6">
        <SectionHeader
          title="Live Transcript"
          subtitle="Real-time conversation captured by PatientPilot AI."
          icon={
            <FileText className="h-6 w-6 text-blue-600" />
          }
        />
      </div>

      {/* Body */}

      <div className="max-h-[650px] overflow-y-auto">

        {visibleMessages.length === 0 ? (

          <div className="flex h-64 items-center justify-center">

            <div className="text-center">

              <FileText className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Waiting for Conversation
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start the demo to begin capturing the transcript.
              </p>

            </div>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {visibleMessages.map((message, index) => {

              const isAI =
                message.speaker === "ai";

              const isPatient =
                message.speaker === "patient";

              const isSystem =
                message.speaker === "system";

              return (

                <motion.div
                  key={message.id}
                  initial={{
                    opacity: 0,
                    x: -16,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.03,
                  }}
                  className="p-5"
                >
                  <div className="flex gap-4">

                    {/* Icon */}

                    <div
                      className={clsx(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        isAI &&
                          "bg-blue-100 text-blue-600",
                        isPatient &&
                          "bg-slate-200 text-slate-700",
                        isSystem &&
                          "bg-amber-100 text-amber-600"
                      )}
                    >
                      {isAI && (
                        <Bot className="h-5 w-5" />
                      )}

                      {isPatient && (
                        <User className="h-5 w-5" />
                      )}

                      {isSystem && (
                        <Clock3 className="h-5 w-5" />
                      )}
                    </div>

                    {/* Message */}

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="font-semibold text-slate-900">

                          {isAI
                            ? "PatientPilot AI"
                            : isPatient
                            ? "Patient"
                            : "System"}

                        </span>

                        <span className="text-slate-300">
                          •
                        </span>

                        <span className="text-sm text-slate-500">
                          {message.timestamp}
                        </span>

                      </div>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {message.text}
                      </p>

                    </div>

                  </div>
                </motion.div>

              );
            })}

          </div>

        )}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-500">
            Transcript Progress
          </span>

          <div className="flex items-center gap-4">

            <span className="text-sm text-slate-500">
              {visibleMessages.length} Entries
            </span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {progress}%
            </span>

          </div>

        </div>

      </div>

    </motion.section>
  );
}