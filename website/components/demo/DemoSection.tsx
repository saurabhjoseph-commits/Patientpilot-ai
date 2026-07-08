"use client";

import { motion } from "framer-motion";
import PhoneMockup from "./PhoneMockup";
import Conversation from "./Conversation";

export default function DemoSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-cyan-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            Live AI Receptionist Demo
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            See PatientPilot AI
            <span className="text-cyan-600"> Answer Calls Automatically</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            Watch how our AI receptionist answers patient calls,
            schedules appointments, and provides a professional
            experience 24/7.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <PhoneMockup>
            <Conversation />
          </PhoneMockup>
        </motion.div>

      </div>
    </section>
  );
}