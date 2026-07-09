"use client";

import AIReceptionist from "@/components/ai/AIReceptionist";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Bot,
  User,
  CalendarCheck,
  CheckCircle2,
  Mail,
  MessageSquare,
} from "lucide-react";

export default function AIDemo() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            Interactive AI Demo
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            See PatientPilot AI in Action
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Watch how PatientPilot AI answers calls, speaks naturally with
            patients, books appointments automatically, and keeps your team
            informed in real time.
          </p>
        </motion.div>

        {/* Live AI Receptionist */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <AIReceptionist />
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          {/* Incoming Call */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white p-8 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <PhoneCall className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Incoming Patient Call
                </h3>

                <p className="text-slate-500">
                  New patient requesting an appointment
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-100 p-6">
              <p className="text-lg leading-8 text-slate-700">
                📞 Hello! I&apos;d like to schedule a dental cleaning sometime
                next week.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="text-green-600" />

              <span className="font-medium text-green-700">
                AI answered within 2 seconds
              </span>
            </div>
          </motion.div>

          {/* AI Conversation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white p-8 shadow-xl"
          >
            <h3 className="mb-8 text-2xl font-bold text-slate-900">
              AI Conversation
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-cyan-100 p-3">
                  <Bot className="h-5 w-5 text-cyan-700" />
                </div>

                <div className="max-w-sm rounded-2xl bg-cyan-50 p-4 text-slate-700">
                  Hello! I&apos;d be happy to help schedule your appointment.
                  Which day works best for you?
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <div className="max-w-sm rounded-2xl bg-slate-100 p-4 text-slate-700">
                  Tuesday morning would be perfect.
                </div>

                <div className="rounded-full bg-slate-200 p-3">
                  <User className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-cyan-100 p-3">
                  <Bot className="h-5 w-5 text-cyan-700" />
                </div>

                <div className="max-w-sm rounded-2xl bg-cyan-50 p-4 text-slate-700">
                  Great! You&apos;re booked for Tuesday at 10:30 AM.
                  You&apos;ll receive confirmation by SMS and email shortly.
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Appointment Confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-14 rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-cyan-100">
                Appointment Confirmed
              </p>

              <h3 className="mt-3 text-4xl font-bold">
                Sarah Johnson
              </h3>

              <p className="mt-2 text-cyan-100">
                Dental Cleaning
              </p>
            </div>

            <div className="rounded-3xl bg-white/20 p-6 text-center backdrop-blur">
              <CalendarCheck className="mx-auto mb-3 h-10 w-10" />

              <h2 className="text-3xl font-bold">
                Tuesday
              </h2>

              <p className="mt-2 text-xl">
                10:30 AM
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-6">
              <MessageSquare className="mb-4 h-8 w-8" />

              <p className="text-sm text-cyan-100">
                SMS Confirmation
              </p>

              <h4 className="mt-2 text-xl font-semibold">
                ✓ Sent
              </h4>
            </div>

            <div className="rounded-2xl bg-white/10 p-6">
              <Mail className="mb-4 h-8 w-8" />

              <p className="text-sm text-cyan-100">
                Email Confirmation
              </p>

              <h4 className="mt-2 text-xl font-semibold">
                ✓ Sent
              </h4>
            </div>

            <div className="rounded-2xl bg-white/10 p-6">
              <CalendarCheck className="mb-4 h-8 w-8" />

              <p className="text-sm text-cyan-100">
                Calendar Updated
              </p>

              <h4 className="mt-2 text-xl font-semibold">
                ✓ Complete
              </h4>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}