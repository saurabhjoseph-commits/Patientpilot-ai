"use client";

import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";

interface CallScreenProps {
  title: string;
  subtitle: string;
}

export default function CallScreen({
  title,
  subtitle,
}: CallScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-cyan-50 to-white px-6 text-center">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
        className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-cyan-600 text-white shadow-2xl"
      >
        <PhoneCall size={44} />
      </motion.div>

      <h2 className="text-3xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-3 max-w-xs text-slate-500">
        {subtitle}
      </p>

      <motion.div
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
        className="mt-8 flex items-center gap-2"
      >
        <span className="h-3 w-3 rounded-full bg-green-500" />

        <span className="text-sm font-medium text-green-700">
          Connecting...
        </span>
      </motion.div>
    </div>
  );
}