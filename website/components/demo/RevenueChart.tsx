"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import SectionHeader from "./SectionHeader";
import { revenueTrend } from "./data";

function CurrencyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      day: string;
      revenue: number;
    };
  }>;
}) {
  if (!active || !payload?.length) return null;

  const revenue = payload[0].value;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {payload[0].payload.day}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        ${revenue.toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-emerald-600">
        Revenue Recovered
      </p>
    </div>
  );
}

export default function RevenueChart() {
  const latestRevenue =
    revenueTrend[revenueTrend.length - 1]?.revenue ?? 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <SectionHeader
        title="Revenue Recovery"
        subtitle="Estimated revenue recovered by PatientPilot AI."
        icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_220px]">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueTrend}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563eb"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="#2563eb"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickFormatter={(value) => `$${value / 1000}k`}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                content={<CurrencyTooltip />}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-slate-50 p-6">
          <p className="text-sm text-slate-500">
            Today's Recovery
          </p>

          <h3 className="mt-2 text-4xl font-bold text-slate-900">
            ${latestRevenue.toLocaleString()}
          </h3>

          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            ▲ 22% vs last week
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            PatientPilot AI recovered missed opportunities by
            answering every incoming patient call and booking
            appointments automatically.
          </p>
        </div>
      </div>
    </motion.section>
  );
}