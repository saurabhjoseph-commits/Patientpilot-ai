"use client";

import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const conversation = [
  {
    id: 1,
    sender: "ai" as const,
    text: "Hello! Thank you for calling Bright Smile Dental.",
    delay: 0,
  },
  {
    id: 2,
    sender: "patient" as const,
    text: "Hi! I'd like to schedule a cleaning.",
    delay: 1800,
  },
  {
    id: 3,
    sender: "ai" as const,
    text: "Absolutely! Tuesday at 10:30 AM is available.",
    delay: 4200,
  },
  {
    id: 4,
    sender: "patient" as const,
    text: "That works perfectly.",
    delay: 6200,
  },
  {
    id: 5,
    sender: "ai" as const,
    text: "Great! Your appointment has been confirmed.",
    delay: 8200,
  },
];

export default function Conversation() {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];

    const playConversation = () => {
      setVisible([]);

      timers = conversation.map((message) =>
        setTimeout(() => {
          setVisible((prev) => [...prev, message.id]);
        }, message.delay)
      );
    };

    playConversation();

    const interval = setInterval(() => {
      playConversation();
    }, 12000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-4 p-6">
      {conversation
        .filter((m) => visible.includes(m.id))
        .map((message) => (
          <MessageBubble
            key={message.id}
            sender={message.sender}
            text={message.text}
          />
        ))}

      {visible.length < conversation.length && (
        <TypingIndicator />
      )}
    </div>
  );
}