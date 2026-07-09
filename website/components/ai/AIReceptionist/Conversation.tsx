"use client";

import { useEffect, useRef, useState } from "react";

import { conversation } from "./data";
import { Message } from "./types";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ConversationProps {
  onComplete: () => void;
}

export default function Conversation({
  onComplete,
}: ConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    let cancelled = false;

    async function speak(text: string, id: number) {
      return new Promise<void>((resolve) => {
        if (!("speechSynthesis" in window)) {
          resolve();
          return;
        }

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        const voices = speechSynthesis.getVoices();

        const preferred =
          voices.find((v) =>
            v.name.toLowerCase().includes("zira")
          ) ||
          voices.find((v) =>
            v.name.toLowerCase().includes("samantha")
          ) ||
          voices.find((v) =>
            v.lang.startsWith("en")
          );

        if (preferred) {
          utterance.voice = preferred;
        }

        setSpeakingId(id);

        utterance.onend = () => {
          setSpeakingId(null);
          resolve();
        };

        utterance.onerror = () => {
          setSpeakingId(null);
          resolve();
        };

        speechSynthesis.speak(utterance);
      });
    }

    async function playConversation() {
      for (const message of conversation) {
        if (cancelled) return;

        setTyping(true);

        await new Promise((r) =>
          setTimeout(r, 1200)
        );

        if (cancelled) return;

        setTyping(false);

        setMessages((prev) => [...prev, message]);

        if (message.sender === "ai") {
          await speak(message.text, message.id);
        } else {
          await new Promise((r) =>
            setTimeout(r, 800)
          );
        }
      }

      await new Promise((r) =>
        setTimeout(r, 1000)
      );

      if (!cancelled) {
        onComplete();
      }
    }

    playConversation();

    return () => {
      cancelled = true;
      speechSynthesis.cancel();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          speaking={speakingId === message.id}
        />
      ))}

      {typing && <TypingIndicator />}
    </div>
  );
}