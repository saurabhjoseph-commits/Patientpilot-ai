"use client";

import { motion } from "framer-motion";
import { Bot, User, Sparkles } from "lucide-react";
import clsx from "clsx";

import type { ConversationMessage } from "./types";

interface MessageBubbleProps {
  message: ConversationMessage;
}

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isAI = message.speaker === "ai";
  const isPatient = message.speaker === "patient";
  const isSystem = message.speaker === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex justify-center"
      >
        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
          {message.text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className={clsx(
        "flex gap-3",
        isPatient && "flex-row-reverse"
      )}
    >
      {/* Avatar */}

      <div
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm",
          isAI
            ? "bg-blue-600 text-white"
            : "bg-slate-800 text-white"
        )}
      >
        {isAI ? (
          <Bot className="h-5 w-5" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>

      {/* Bubble */}

      <div
        className={clsx(
          "max-w-[78%]",
          isPatient && "items-end text-right"
        )}
      >
        {/* Header */}

        <div
          className={clsx(
            "mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500",
            isPatient && "justify-end"
          )}
        >
          {isAI && (
            <>
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />

              <span>PatientPilot AI</span>
            </>
          )}

          {isPatient && (
            <span>Patient</span>
          )}

          <span>•</span>

          <span>{message.timestamp}</span>
        </div>

        {/* Bubble */}

        <div
          className={clsx(
            "rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm",
            isAI
              ? "rounded-tl-md bg-blue-600 text-white"
              : "rounded-tr-md border border-slate-200 bg-white text-slate-900"
          )}
        >
          {message.text}
        </div>
      </div>
    </motion.div>
  );
}