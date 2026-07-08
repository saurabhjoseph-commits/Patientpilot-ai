"use client";

import { motion } from "framer-motion";
import {
  PhoneCall,
  Clock3,
  CalendarCheck,
  MessageSquare,
} from "lucide-react";

const stats = [
  {
    icon: PhoneCall,
    value: "24/7",
    label: "AI Call Answering",
  },
  {
    icon: Clock3,
    value: "<10s",
    label: "Average Response Time",
  },
  {
    icon: CalendarCheck,
    value: "100%",
    label: "Appointment Request Coverage",
  },
  {
    icon: MessageSquare,
    value: "Multi",
    label: "Patient Conversations at Once",
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-cyan-400 font-semibold uppercase tracking-wider">
            Product Highlights
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Built for Modern Dental Practices
          </h2>

          <p className="mt-6 text-lg text-slate-300">
            PatientPilot AI is designed to help clinics respond faster, stay
            available around the clock, and streamline everyday communication.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-slate-800 p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600">
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="text-4xl font-bold text-cyan-400">
                  {stat.value}
                </h3>

                <p className="mt-3 text-slate-300">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}