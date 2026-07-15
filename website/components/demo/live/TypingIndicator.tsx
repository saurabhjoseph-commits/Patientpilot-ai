"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

interface TypingIndicatorProps {
  label?: string;
}

export default function TypingIndicator({
  label = "PatientPilot AI is thinking...",
}: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className="flex gap-3"
    >
      {/* Avatar */}

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
        <Bot className="h-5 w-5" />
      </div>

      {/* Bubble */}

      <div className="max-w-xs">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span>PatientPilot AI</span>
        </div>

        <div className="rounded-3xl rounded-tl-md bg-blue-600 px-5 py-4 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-2.5 w-2.5 rounded-full bg-white"
                  animate={{
                    y: [-2, -8, -2],
                    opacity: [0.35, 1, 0.35],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: dot * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <span className="text-sm font-medium text-blue-100">
              {label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}