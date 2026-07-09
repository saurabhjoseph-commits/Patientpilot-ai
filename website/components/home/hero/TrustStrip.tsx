"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  CalendarCheck2,
  PhoneCall,
  Sparkles,
} from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    label: "HIPAA Ready",
    color: "text-emerald-600",
  },
  {
    icon: Clock3,
    label: "24/7 AI Receptionist",
    color: "text-blue-600",
  },
  {
    icon: CalendarCheck2,
    label: "Appointment Booking",
    color: "text-indigo-600",
  },
  {
    icon: PhoneCall,
    label: "Missed Call Recovery",
    color: "text-cyan-600",
  },
];

export default function TrustStrip() {
  return (
    <div className="mt-12">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6 flex items-center gap-3"
      >
        <Sparkles className="text-amber-500" size={20} />

        <p className="font-semibold text-slate-700">
          Trusted by Modern Dental Practices
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="rounded-2xl border border-slate-200 bg-white/90 shadow-lg backdrop-blur-xl transition-all hover:shadow-2xl"
            >
              <div className="flex h-36 flex-col items-center justify-center p-5 text-center">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 ${badge.color}`}
                >
                  <Icon size={26} />
                </div>

                <p className="text-sm font-semibold leading-6 text-slate-800">
                  {badge.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500"
      >
        <span className="font-semibold text-amber-500">★★★★★</span>

        <span>Enterprise Security</span>

        <span>Secure Cloud Platform</span>

        <span>Built for U.S. Dental Clinics</span>

        <span>Fast Deployment</span>
      </motion.div>
    </div>
  );
}