// website/components/admin/live/AIStatusBadge.tsx

import clsx from "clsx";
import {
  PhoneCall,
  User,
  Phone,
  ClipboardList,
  Calendar,
  CheckCircle2,
  ArrowRightCircle,
  XCircle,
  PauseCircle,
} from "lucide-react";

import type { AIConversationState } from "@/lib/ai/core";

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
      "bg-gray-100 text-gray-700 border-gray-200",
    icon: PauseCircle,
  },

  greeting: {
    label: "Greeting",
    className:
      "bg-sky-100 text-sky-700 border-sky-200",
    icon: PhoneCall,
  },

  collecting_name: {
    label: "Collecting Name",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: User,
  },

  collecting_phone: {
    label: "Collecting Phone",
    className:
      "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: Phone,
  },

  collecting_reason: {
    label: "Collecting Reason",
    className:
      "bg-amber-100 text-amber-700 border-amber-200",
    icon: ClipboardList,
  },

  collecting_date: {
    label: "Collecting Date",
    className:
      "bg-purple-100 text-purple-700 border-purple-200",
    icon: Calendar,
  },

  confirming: {
    label: "Confirming",
    className:
      "bg-orange-100 text-orange-700 border-orange-200",
    icon: ArrowRightCircle,
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
      "bg-red-100 text-red-700 border-red-200",
    icon: ArrowRightCircle,
  },

  ended: {
    label: "Ended",
    className:
      "bg-slate-100 text-slate-700 border-slate-200",
    icon: XCircle,
  },
};

export default function AIStatusBadge({
  state,
}: AIStatusBadgeProps) {
  const config =
    STATUS_CONFIG[state] ??
    STATUS_CONFIG.idle;

  const Icon = config.icon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}