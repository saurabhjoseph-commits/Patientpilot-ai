"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock3,
  DollarSign,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Appointment Bookings",
    description:
      "Capture more opportunities by answering every patient inquiry instantly.",
  },
  {
    icon: Clock3,
    title: "Save Staff Time",
    description:
      "Reduce repetitive phone calls so your front desk can focus on patient care.",
  },
  {
    icon: DollarSign,
    title: "Reduce Operational Costs",
    description:
      "Automate routine communication without compromising service quality.",
  },
  {
    icon: Users,
    title: "Improve Patient Experience",
    description:
      "Provide fast, friendly responses 24/7 that keep patients engaged.",
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-cyan-600 font-semibold uppercase tracking-wider">
            Business Benefits
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            More Than an AI Receptionist
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            PatientPilot AI helps dental practices increase efficiency,
            improve patient satisfaction, and grow revenue with intelligent
            automation.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition"
              >
                <div className="inline-flex rounded-2xl bg-cyan-100 p-4 mb-6">
                  <Icon className="h-8 w-8 text-cyan-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-4 text-slate-600 leading-7">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}