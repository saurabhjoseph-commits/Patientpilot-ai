"use client";

import {
  Brain,
  CheckCircle2,
  Headphones,
  Loader2,
  Phone,
  PhoneCall,
  UserRound,
  XCircle,
} from "lucide-react";

import type { AIConversationState } from "@/lib/ai/types";

interface AIStatusBadgeProps {
  state: AIConversationState | "idle";
}

const STATUS_CONFIG: Record<
  AIConversationState | "idle",
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  idle: {
    label: "Idle",
    className:
      "bg-slate-100 text-slate-700 border-slate-200",
    icon: Phone,
  },

  greeting: {
    label: "Greeting",
    className:
      "bg-blue-100 text-blue-700 border-blue-200",
    icon: PhoneCall,
  },

  collecting_name: {
    label: "Collecting Name",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: UserRound,
  },

  collecting_phone: {
    label: "Collecting Phone",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: UserRound,
  },

  collecting_reason: {
    label: "Collecting Reason",
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Headphones,
  },

  collecting_date: {
    label: "Collecting Date",
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Headphones,
  },

  confirming: {
    label: "Confirming",
    className:
      "bg-purple-100 text-purple-700 border-purple-200",
    icon: Brain,
  },

  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
  },

  handoff: {
    label: "Human Handoff",
    className:
      "bg-orange-100 text-orange-700 border-orange-200",
    icon: Loader2,
  },

  ended: {
    label: "Ended",
    className:
      "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

export default function AIStatusBadge({
  state,
}: AIStatusBadgeProps) {
  const config = STATUS_CONFIG[state] ?? STATUS_CONFIG.idle;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-4 w-4" />

      {config.label}
    </span>
  );
}