"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck2,
  PhoneCall,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

import SectionHeader from "./SectionHeader";
import { recentActivity } from "./data";

const iconMap = {
  success: CalendarCheck2,
  info: ShieldCheck,
  warning: AlertCircle,
};

const colorMap = {
  success: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  info: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    dot: "bg-blue-500",
  },
  warning: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    dot: "bg-amber-500",
  },
};

export default function ActivityFeed() {
  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="Live Activity"
        subtitle="Real-time AI Receptionist events"
        icon={<PhoneCall className="h-6 w-6 text-blue-600" />}
      />

      <div className="mt-8 space-y-5">
        {recentActivity.map((activity, index) => {
          const Icon = iconMap[activity.status];
          const colors = colorMap[activity.status];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
              }}
              className="flex gap-4"
            >
              {/* Timeline */}

              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors.bg}`}
                >
                  <Icon
                    className={`h-5 w-5 ${colors.icon}`}
                  />
                </div>

                {index !== recentActivity.length - 1 && (
                  <div className="mt-2 h-12 w-px bg-slate-200" />
                )}
              </div>

              {/* Content */}

              <div className="flex-1 rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {activity.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${colors.dot}`}
                  />

                  <span className="text-xs font-medium text-slate-500">
                    Processed by PatientPilot AI
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600" />

          <div>
            <p className="font-semibold text-slate-900">
              AI Receptionist Active
            </p>

            <p className="text-sm text-slate-500">
              Monitoring incoming calls and updating the CRM in real time.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}