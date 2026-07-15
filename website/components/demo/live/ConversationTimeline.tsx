"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";

import { useDemo } from "./DemoProvider";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ConversationTimeline() {
  const {
    visibleMessages,
    currentMessage,
    isPlaying,
    stage,
    isCompleted,
  } = useDemo();

  const containerRef =
    useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll whenever a new message appears
   */
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages]);

  /**
   * Show typing indicator only when:
   *
   * - demo is running
   * - current stage is thinking
   * - demo isn't complete
   */
  const showTyping =
    isPlaying &&
    stage === "thinking" &&
    !isCompleted;

  return (
    <div
      ref={containerRef}
      className="
        h-[650px]
        overflow-y-auto
        rounded-3xl
        border
        border-slate-200
        bg-slate-50
        p-6
        shadow-sm
      "
    >
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showTyping && currentMessage && (
            <TypingIndicator
              label="PatientPilot AI is thinking..."
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}