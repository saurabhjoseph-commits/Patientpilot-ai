"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const traditional = [
  "Limited to office hours",
  "Missed calls during busy periods",
  "Manual appointment scheduling",
  "Long patient hold times",
  "Staff spends hours answering repetitive questions",
];

const patientPilot = [
  "Available 24/7, including weekends",
  "Answers every incoming call instantly",
  "Books, reschedules and confirms appointments",
  "Provides immediate responses",
  "Allows staff to focus on in-office patient care",
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-cyan-600 font-semibold uppercase tracking-wider">
            Why Choose PatientPilot AI
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            A Smarter Way to Support Your Front Desk
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            PatientPilot AI handles repetitive communication tasks so your team
            can spend more time delivering excellent patient care.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">

          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-red-200 bg-red-50 p-8"
          >
            <h3 className="text-2xl font-bold text-red-700 mb-8">
              Traditional Front Desk Challenges
            </h3>

            <div className="space-y-5">
              {traditional.map((item) => (
                <div key={item} className="flex gap-3">
                  <XCircle className="mt-1 h-6 w-6 text-red-500 flex-shrink-0" />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PatientPilot */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8"
          >
            <h3 className="text-2xl font-bold text-cyan-700 mb-8">
              With PatientPilot AI
            </h3>

            <div className="space-y-5">
              {patientPilot.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle className="mt-1 h-6 w-6 text-green-600 flex-shrink-0" />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}