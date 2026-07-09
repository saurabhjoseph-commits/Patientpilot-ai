"use client";

import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

import { MessageBubbleProps } from "./types";

export default function MessageBubble({
  message,
  speaking = false,
}: MessageBubbleProps) {
  const ai = message.sender === "ai";

  return (
    <div
      className={`flex items-end gap-2 ${
        ai ? "justify-start" : "justify-end"
      }`}
    >
      {ai && (
        <motion.div
          animate={
            speaking
              ? {
                  scale: [1, 1.12, 1],
                }
              : {}
          }
          transition={{
            repeat: speaking ? Infinity : 0,
            duration: 0.8,
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100"
        >
          <Bot
            size={18}
            className="text-cyan-700"
          />
        </motion.div>
      )}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-md ${
          ai
            ? "rounded-bl-md bg-white"
            : "rounded-br-md bg-cyan-600 text-white"
        }`}
      >
        {message.text}
      </motion.div>

      {!ai && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">
          <User size={18} />
        </div>
      )}
    </div>
  );
}