"use client";

import { motion } from "framer-motion";

export default function FloatingBackground() {
  return (
    <>
      {/* Top Left */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"
      />

      {/* Top Right */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-3xl"
      />

      {/* Bottom */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute bottom-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-300/15 blur-3xl"
      />

      {/* Small Glow */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-cyan-200/20 blur-2xl"
      />

      {/* Small Glow */}
      <motion.div
        animate={{
          y: [0, 25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute right-1/4 bottom-20 h-52 w-52 rounded-full bg-blue-200/20 blur-2xl"
      />
    </>
  );
}