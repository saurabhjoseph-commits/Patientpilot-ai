"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-end gap-3"
    >
      {/* AI Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg">
        <Bot size={18} />
      </div>

      {/* Bubble */}
      <div className="rounded-2xl rounded-bl-md bg-cyan-500 px-5 py-3 shadow-lg">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -5, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-2 w-2 rounded-full bg-white"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}