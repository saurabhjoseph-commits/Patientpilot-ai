"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <>
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 70, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-44 top-12 h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-blue-500/20 blur-[160px]"
        />

        <motion.div
          animate={{
            y: [0, -60, 0],
            x: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-indigo-400/20 blur-[150px]"
        />

      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right,#2563eb 1px,transparent 1px),
            linear-gradient(to bottom,#2563eb 1px,transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent_70%)]" />

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
    </>
  );
}