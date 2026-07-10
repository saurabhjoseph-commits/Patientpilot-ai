"use client";

import { motion } from "framer-motion";
import {
  Bot,
  User,
  Clock3,
} from "lucide-react";

import type { TranscriptMessage } from "@/types/call-center";

interface CallTranscriptProps {
  messages: TranscriptMessage[];
}

export default function CallTranscript({
  messages,
}: CallTranscriptProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[720px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Live Call Transcript
          </h2>

          <p className="text-sm text-slate-500">
            Conversation updates in real time
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Live
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "ai"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                message.sender === "ai"
                  ? "border border-slate-200 bg-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                {message.sender === "ai" ? (
                  <>
                    <Bot className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-slate-900">
                      AI Receptionist
                    </span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span className="font-semibold">
                      Patient
                    </span>
                  </>
                )}
              </div>

              <p
                className={`leading-relaxed ${
                  message.sender === "ai"
                    ? "text-slate-700"
                    : "text-white"
                }`}
              >
                {message.text}
              </p>

              <div
                className={`mt-3 flex items-center gap-2 text-xs ${
                  message.sender === "ai"
                    ? "text-slate-500"
                    : "text-blue-100"
                }`}
              >
                <Clock3 className="h-3.5 w-3.5" />
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          AI is actively listening for the patient's response...
        </div>
      </div>
    </motion.div>
  );
}