"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  CalendarDays,
  MessageSquare,
  Lock,
  Cloud,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: ShieldCheck,
    title: "HIPAA-Ready Design",
    description:
      "Built with security and privacy in mind to support modern dental practices.",
  },
  {
    icon: Clock3,
    title: "24/7 AI Receptionist",
    description:
      "Answer every patient call, even after business hours.",
  },
  {
    icon: CalendarDays,
    title: "Appointment Scheduling",
    description:
      "Book and manage appointments automatically.",
  },
  {
    icon: MessageSquare,
    title: "SMS Confirmations",
    description:
      "Automatically send reminders and confirmations to patients.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Encrypted communication and secure infrastructure for your practice.",
  },
  {
    icon: Cloud,
    title: "Cloud Platform",
    description:
      "Reliable cloud infrastructure with high availability.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Trust & Security
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 lg:text-5xl">
            Built for Modern Dental Practices
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-lg text-slate-600">
            PatientPilot AI helps your practice answer every call, automate
            scheduling, and deliver a professional patient experience with
            secure, reliable AI automation.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl"
              >
                <div className="inline-flex rounded-2xl bg-blue-100 p-4 text-blue-600">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white"
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold">
                Never Miss Another Patient Opportunity
              </h3>

              <p className="mt-4 text-blue-100 text-lg">
                Every missed call is a potential lost patient. Let PatientPilot
                AI answer every call, schedule appointments, and help your
                practice grow.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <span className="rounded-full bg-white/20 px-4 py-2">
                  24/7 Availability
                </span>

                <span className="rounded-full bg-white/20 px-4 py-2">
                  Secure Platform
                </span>

                <span className="rounded-full bg-white/20 px-4 py-2">
                  AI Appointment Booking
                </span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-700 transition hover:scale-105"
              >
                Book Your Free Demo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}