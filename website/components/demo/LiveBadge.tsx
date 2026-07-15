"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type LiveBadgeStatus = "live" | "paused" | "offline";

interface LiveBadgeProps {
  status?: LiveBadgeStatus;
  label?: string;
  size?: "sm" | "md";
}

const statusConfig = {
  live: {
    label: "LIVE",
    dot: "bg-emerald-500",
    ring: "bg-emerald-400",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  paused: {
    label: "PAUSED",
    dot: "bg-amber-500",
    ring: "bg-amber-400",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700",
  },
  offline: {
    label: "OFFLINE",
    dot: "bg-slate-400",
    ring: "bg-slate-300",
    badge:
      "border-slate-200 bg-slate-100 text-slate-600",
  },
};

export default function LiveBadge({
  status = "live",
  label,
  size = "md",
}: LiveBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border font-semibold tracking-wide",
        config.badge,
        size === "sm"
          ? "gap-2 px-3 py-1 text-xs"
          : "gap-2.5 px-4 py-2 text-sm"
      )}
    >
      <div className="relative flex items-center justify-center">
        {status === "live" && (
          <motion.span
            className={clsx(
              "absolute rounded-full",
              config.ring,
              size === "sm"
                ? "h-2.5 w-2.5"
                : "h-3 w-3"
            )}
            animate={{
              scale: [1, 2.2],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        <span
          className={clsx(
            "relative rounded-full",
            config.dot,
            size === "sm"
              ? "h-2 w-2"
              : "h-2.5 w-2.5"
          )}
        />
      </div>

      <span>{label ?? config.label}</span>
    </div>
  );
}