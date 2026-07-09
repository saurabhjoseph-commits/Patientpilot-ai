"use client";

import { motion } from "framer-motion";
import {
  Phone,
  CalendarCheck,
  Star,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: Phone,
    title: "Calls Answered",
    value: "127",
    subtitle: "Today",
    color: "text-blue-600",
    position:
      "left-0 top-8 -translate-x-8",
    duration: 4,
  },
  {
    icon: CalendarCheck,
    title: "Appointments",
    value: "18",
    subtitle: "Booked Today",
    color: "text-emerald-600",
    position:
      "right-0 top-24 translate-x-8",
    duration: 5,
  },
  {
    icon: Star,
    title: "Patient Rating",
    value: "98%",
    subtitle: "Satisfaction",
    color: "text-amber-500",
    position:
      "left-10 bottom-8",
    duration: 4.5,
  },
  {
    icon: TrendingUp,
    title: "Revenue",
    value: "+$6.2K",
    subtitle: "Recovered",
    color: "text-cyan-600",
    position:
      "right-12 bottom-12",
    duration: 6,
  },
];

export default function FloatingStats() {
  return (
    <>
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute ${item.position} hidden xl:flex z-30`}
          >
            <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur-xl shadow-2xl px-5 py-4 w-56">

              <div className="flex items-center gap-3">

                <div className={`rounded-2xl bg-slate-100 p-3 ${item.color}`}>
                  <Icon size={22} />
                </div>

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.title}
                  </p>

                  <h3 className={`text-3xl font-black ${item.color}`}>
                    {item.value}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.subtitle}
                  </p>

                </div>

              </div>

            </div>
          </motion.div>
        );
      })}
    </>
  );
}