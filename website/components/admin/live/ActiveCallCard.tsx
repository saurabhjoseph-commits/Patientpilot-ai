"use client";

import {
  Calendar,
  Clock3,
  Phone,
  User,
} from "lucide-react";

import AIStatusBadge from "./AIStatusBadge";

import type { LiveCall } from "@/types/live-monitor";

interface ActiveCallCardProps {
  call: LiveCall;

  onClick?: (call: LiveCall) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
}

export default function ActiveCallCard({
  call,
  onClick,
}: ActiveCallCardProps) {
  const latestMessage =
    call.transcript.length > 0
      ? call.transcript[call.transcript.length - 1]
      : undefined;

  return (
    <button
      type="button"
      onClick={() => onClick?.(call)}
      className="w-full rounded-xl border bg-white p-5 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Phone className="h-5 w-5 text-blue-600" />

            {call.from}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Call SID: {call.callSid}
          </p>
        </div>

        <AIStatusBadge state={call.aiState} />
      </div>

      {/* Info Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock3 className="h-4 w-4 text-slate-400" />

          Duration

          <span className="font-medium text-slate-900">
            {formatDuration(call.durationSeconds)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="h-4 w-4 text-slate-400" />

          Intent

          <span className="font-medium capitalize text-slate-900">
            {call.intent.replaceAll("_", " ")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />

          Started

          <span className="font-medium text-slate-900">
            {new Date(call.startedAt).toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="h-4 w-4 text-slate-400" />

          Status

          <span className="font-medium capitalize text-slate-900">
            {call.status}
          </span>
        </div>
      </div>

      {/* Transcript Preview */}
      <div className="mt-5 rounded-lg bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Latest Conversation
        </p>

        {latestMessage ? (
          <>
            <p className="mb-1 text-xs font-semibold uppercase text-blue-600">
              {latestMessage.speaker}
            </p>

            <p className="line-clamp-3 text-sm text-slate-700">
              {latestMessage.text}
            </p>
          </>
        ) : (
          <p className="text-sm italic text-slate-400">
            Waiting for conversation...
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-xs text-slate-500">
          Updated{" "}
          {new Date(call.updatedAt).toLocaleTimeString()}
        </span>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Live
        </span>
      </div>
    </button>
  );
}