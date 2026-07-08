"use client";

import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import clsx from "clsx";

interface MessageBubbleProps {
  sender: "user" | "ai";
  text: string;
}

export default function MessageBubble({
  sender,
  text,
}: MessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={clsx(
        "flex w-full items-end gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-white">
          <Bot size={16} />
        </div>
      )}

      <div
        className={clsx(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md",
          isUser
            ? "rounded-br-sm bg-cyan-600 text-white"
            : "rounded-bl-sm bg-white text-slate-800"
        )}
      >
        {text}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white">
          <User size={16} />
        </div>
      )}
    </motion.div>
  );
}