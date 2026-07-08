"use client";

import { motion } from "framer-motion";
import {
  Phone,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Bot,
  Clock,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Phone,
    title: "AI Receptionist",
    description:
      "Answer every patient call 24/7 with a natural, friendly AI receptionist that never misses an opportunity.",
  },
  {
    icon: CalendarDays,
    title: "Appointment Booking",
    description:
      "Automatically schedule, reschedule, and cancel appointments while reducing front desk workload.",
  },
  {
    icon: MessageSquare,
    title: "Patient Support",
    description:
      "Instantly answer common patient questions about treatments, insurance, office hours, and more.",
  },
  {
    icon: Bot,
    title: "AI Chat Assistant",
    description:
      "Provide instant website chat support to convert visitors into booked appointments.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Your clinic remains available day and night, ensuring no patient inquiry goes unanswered.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Track call volume, appointment trends, and AI performance through easy-to-understand reports.",
  },
];

export default function Services() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            Our Solutions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            AI Solutions Built for Modern Dental Practices
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            PatientPilot AI helps dental clinics automate patient communication,
            improve scheduling, and deliver exceptional experiences while saving
            valuable staff time.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-cyan-200 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-cyan-100 p-4">
                  <Icon className="h-8 w-8 text-cyan-600" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mb-6 leading-7 text-slate-600">
                  {service.description}
                </p>

                <button className="inline-flex items-center gap-2 font-semibold text-cyan-600 transition group-hover:gap-3">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-600 p-10 text-center text-white"
        >
          <h3 className="text-3xl font-bold">
            Ready to Transform Your Dental Practice?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-cyan-100">
            Let PatientPilot AI handle your calls, appointments, and patient
            communication so your team can focus on delivering outstanding care.
          </p>

          <button className="mt-8 rounded-xl bg-white px-8 py-4 font-semibold text-cyan-700 transition hover:scale-105">
            Schedule a Free Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}