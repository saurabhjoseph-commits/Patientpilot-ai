"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Phone,
  Calendar,
  DollarSign,
  Bot,
  Timer,
  HeartHandshake,
} from "lucide-react";
import clsx from "clsx";

import AnimatedCounter from "./AnimatedCounter";

type Trend = "up" | "down" | "neutral";

interface MetricCardProps {
  title: string;

  /**
   * Can be either:
   *  - number (uses AnimatedCounter)
   *  - formatted string (renders directly)
   */
  value: number | string;

  icon: string;

  trend?: Trend;

  change?: string;

  prefix?: string;

  suffix?: string;

  decimals?: number;
}

const iconMap = {
  Phone,
  Calendar,
  DollarSign,
  Bot,
  Timer,
  HeartHandshake,
} as const;

const trendStyles = {
  up: {
    icon: ArrowUpRight,
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },

  down: {
    icon: ArrowDownRight,
    className:
      "bg-red-50 text-red-700 border border-red-200",
  },

  neutral: {
    icon: Minus,
    className:
      "bg-slate-100 text-slate-700 border border-slate-200",
  },
} as const;

export default function MetricCard({
  title,
  value,
  icon,
  trend = "neutral",
  change,
  prefix,
  suffix,
  decimals = 0,
}: MetricCardProps) {
  const Icon =
    iconMap[icon as keyof typeof iconMap] ??
    Phone;

  const TrendIcon =
    trendStyles[trend].icon;

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
        duration: 0.35,
      }}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.18,
        },
      }}
      className="
        group
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-200
        hover:border-blue-200
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-blue-50
            text-blue-600
            transition-colors
            group-hover:bg-blue-100
          "
        >
          <Icon className="h-7 w-7" />
        </div>

        {change && (
          <div
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
              trendStyles[trend].className
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {change}
          </div>
        )}
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          {typeof value === "number" ? (
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          ) : (
            value
          )}
        </div>
      </div>
    </motion.div>
  );
}