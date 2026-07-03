"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  PlayCircle,
} from "lucide-react";

import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-24">

      {/* Background Blur */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl"></div>

      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl"></div>

      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-100/30 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* Left Side */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="inline-flex items-center rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            🦷 Built for Modern Dental Practices
          </div>

          <h1 className="mt-8 text-5xl font-black leading-tight text-slate-900 md:text-7xl">
            Never Miss
            <br />
            Another
            <span className="text-blue-600"> Patient Call.</span>
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-9 text-slate-600">
            PatientPilot AI answers every patient call, books appointments,
            follows up automatically, and works 24/7 so your dental team can
            focus on delivering exceptional care.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/book-demo"
              className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Book Free Demo
            </Link>

            <Link
              href="/solutions"
              className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <PlayCircle size={22} />
              Watch AI Demo
            </Link>

          </div>

          {/* Trust */}

          <div className="mt-10 grid gap-4 sm:grid-cols-3">

            <TrustItem text="24/7 AI Receptionist" />

            <TrustItem text="Instant Appointment Booking" />

            <TrustItem text="Built for Dental Clinics" />

          </div>

        </motion.div>

        {/* Dashboard */}

        <HeroDashboard />

      </div>

    </section>
  );
}

function TrustItem({
  text,
}: {
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex items-center gap-2 rounded-xl bg-white p-4 shadow-md"
    >
      <CheckCircle className="text-green-600" size={20} />

      <span className="text-sm font-semibold text-slate-700">
        {text}
      </span>
    </motion.div>
  );
}