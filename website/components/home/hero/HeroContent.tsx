"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

import TrustStrip from "./TrustStrip";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10"
    >
      {/* Live Badge */}
      <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white/90 px-5 py-2 shadow-lg backdrop-blur">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
        </span>

        <Activity
          size={16}
          className="text-emerald-600"
        />

        <span className="font-semibold text-slate-700">
          AI Receptionist Online
        </span>
      </div>

      {/* Heading */}

      <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-slate-900 lg:text-7xl">
        Never Miss
        <br />
        Another Patient
        <br />
        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Call Again.
        </span>
      </h1>

      {/* Description */}

      <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">
        Answer every patient call, recover missed appointments,
        automate scheduling, and help your dental practice
        grow with an AI receptionist that works
        <span className="font-semibold text-slate-900">
          {" "}24 hours a day.
        </span>
      </p>

      {/* CTA */}

      <div className="mt-10 flex flex-wrap gap-4">

        <Link
          href="/book-demo"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          Book Free Strategy Session

          <ArrowRight size={20} />
        </Link>

        <Link
          href="/solutions"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-slate-50"
        >
          <PlayCircle size={22} />

          Watch Live AI Demo
        </Link>

      </div>

      {/* Micro Trust */}

      <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">

        <span>⚡ Average setup in 7 days</span>

        <span>✓ No long-term contracts</span>

        <span>✓ Personalized onboarding</span>

      </div>

      {/* Trust Strip */}

      <TrustStrip />

    </motion.div>
  );
}