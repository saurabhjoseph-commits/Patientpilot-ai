"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Calendar,
  Star,
  TrendingUp,
  Activity,
  Bot,
} from "lucide-react";

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl"
    >
      {/* Live Badge */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold text-slate-900">
          Live AI Dashboard
        </h2>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
          }}
          className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2"
        >
          <span className="h-3 w-3 rounded-full bg-green-500"></span>

          <span className="font-semibold text-green-700">
            Live
          </span>
        </motion.div>
      </div>

      {/* Cards */}

      <div className="space-y-5">

        <DashboardCard
          icon={<Phone className="text-blue-600" />}
          title="Incoming Calls"
          value="24"
        />

        <DashboardCard
          icon={<Calendar className="text-blue-600" />}
          title="Appointments"
          value="18"
        />

        <DashboardCard
          icon={<Star className="text-yellow-500" />}
          title="Google Reviews"
          value="4.9 ★"
        />

      </div>

      {/* AI Status */}

      <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">

        <div className="flex items-center gap-3">

          <Bot className="text-cyan-600" />

          <div>

            <h4 className="font-bold text-slate-800">
              AI Receptionist
            </h4>

            <p className="text-sm text-slate-500">
              Answering calls automatically
            </p>

          </div>

        </div>

      </div>

      {/* Growth */}

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white"
      >

        <div className="text-sm uppercase tracking-widest text-blue-100">
          Estimated Monthly Growth
        </div>

        <div className="mt-5 flex items-center gap-4">

          <TrendingUp size={40} />

          <h1 className="text-6xl font-black">
            +35%
          </h1>

        </div>

        <p className="mt-5 leading-7 text-blue-100">
          More answered calls.
          More appointments.
          More revenue.
        </p>

      </motion.div>

      {/* Bottom Status */}

      <div className="mt-8 flex items-center gap-3 rounded-xl bg-slate-100 p-4">

        <Activity className="text-green-600" />

        <span className="font-medium text-slate-700">
          AI has answered 247 calls today
        </span>

      </div>

    </motion.div>
  );
}

function DashboardCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      className="flex items-center justify-between rounded-2xl bg-slate-50 p-5"
    >
      <div className="flex items-center gap-4">
        {icon}

        <span className="text-lg font-medium">
          {title}
        </span>
      </div>

      <span className="text-2xl font-bold">
        {value}
      </span>
    </motion.div>
  );
}