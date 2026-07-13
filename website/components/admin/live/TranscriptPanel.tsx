"use client";

import { useEffect, useRef } from "react";
import {
  Bot,
  Clock3,
  User,
} from "lucide-react";

import type {
  TranscriptMessage,
} from "@/types/live-monitor";

interface TranscriptPanelProps {
  transcript: TranscriptMessage[];
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function TranscriptPanel({
  transcript,
}: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [transcript]);

  return (
    <div className="flex h-[650px] flex-col rounded-xl border bg-white shadow-sm">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Live Transcript
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Conversation between the patient and
          PatientPilot AI.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {transcript.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Bot className="mx-auto mb-4 h-10 w-10 text-slate-300" />

              <h3 className="text-lg font-medium text-slate-600">
                Waiting for conversation...
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Messages will appear here once the
                caller starts speaking.
              </p>
            </div>
          </div>
        ) : (
          transcript.map((message) => {
            const isUser =
              message.speaker === "user";

            const isAssistant =
              message.speaker === "assistant";

            return (
              <div
                key={message.id}
                className={`flex ${
                  isUser
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                      ? "bg-slate-100"
                      : isAssistant
                      ? "bg-blue-600 text-white"
                      : "bg-amber-100"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    {isUser ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {isUser
                        ? "Patient"
                        : isAssistant
                        ? "PatientPilot AI"
                        : "System"}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.text}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs opacity-75">
                    <Clock3 className="h-3 w-3" />

                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="border-t bg-slate-50 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Messages: {transcript.length}
          </span>

          <span>Live Monitoring Enabled</span>
        </div>
      </div>
    </div>
  );
}