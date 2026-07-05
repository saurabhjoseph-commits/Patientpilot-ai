"use client";

import { motion } from "framer-motion";
import { PhoneMockupProps } from "@/types/demo";

export default function PhoneMockup({
  children,
}: PhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative mx-auto h-[700px] w-[340px]"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-[56px] bg-cyan-400/20 blur-3xl" />

      {/* Phone */}
      <div className="relative h-full overflow-hidden rounded-[56px] border border-slate-700 bg-black shadow-2xl">

        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-4 z-20 h-8 w-32 -translate-x-1/2 rounded-full bg-black" />

        {/* Header */}
        <div className="absolute top-14 z-10 flex w-full items-center justify-between px-6 text-white">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Live Call
            </span>
          </div>

          <span className="text-xs font-mono">00:24</span>
        </div>

        {/* Screen */}
        <div className="absolute inset-2 mt-12 overflow-hidden rounded-[46px] bg-gradient-to-b from-slate-900 via-slate-950 to-black">
          {children}
        </div>
      </div>
    </motion.div>
  );
}