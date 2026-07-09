"use client";

import { motion } from "framer-motion";
import {
  Bot,
  PhoneCall,
  CalendarCheck2,
  DollarSign,
  Activity,
} from "lucide-react";

const messages = [
  {
    sender: "patient",
    text: "Hi, I'd like to schedule a cleaning.",
  },
  {
    sender: "ai",
    text: "Absolutely! What day works best for you?",
  },
  {
    sender: "patient",
    text: "Tuesday morning.",
  },
  {
    sender: "ai",
    text: "You're booked for Tuesday at 10:00 AM.",
  },
];

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-xl rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-2xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3">
            <Bot className="text-blue-600" size={26} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Live AI Receptionist
            </h3>

            <p className="text-sm text-slate-500">
              Answering calls in real time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-emerald-700">
            Live
          </span>
        </div>
      </div>

      {/* Incoming Call */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <PhoneCall className="text-blue-600" size={22} />
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                Emily Johnson
              </h4>

              <p className="text-sm text-slate-500">
                New Patient
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">
              Call Time
            </div>

            <div className="font-bold text-slate-900">
              00:08
            </div>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`flex ${
              msg.sender === "ai"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === "ai"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Success */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-5 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarCheck2 size={24} />
            <div>
              <h4 className="font-bold">
                Appointment Confirmed
              </h4>
              <p className="text-sm text-emerald-100">
                Tuesday • 10:00 AM
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm">
              Revenue
            </div>

            <div className="flex items-center gap-1 text-2xl font-black">
              <DollarSign size={22} />
              650
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Metric title="Calls" value="127" />
        <Metric title="Bookings" value="18" />
        <Metric title="Rating" value="98%" />
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-100 p-4">
        <Activity className="text-emerald-600" />

        <span className="text-sm font-medium text-slate-700">
          AI has answered 127 patient calls today
        </span>
      </div>
    </motion.div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {title}
      </div>

      <div className="mt-2 text-2xl font-black text-slate-900">
        {value}
      </div>
    </div>
  );
}