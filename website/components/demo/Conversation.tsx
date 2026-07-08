"use client";

import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const conversation: Message[] = [
  {
    sender: "user",
    text: "Hi, I'd like to book a teeth cleaning appointment.",
  },
  {
    sender: "ai",
    text: "Absolutely! I'd be happy to help. May I have your full name?",
  },
  {
    sender: "user",
    text: "John Smith.",
  },
  {
    sender: "ai",
    text: "Thank you, John. We have availability this Thursday at 2:00 PM or Friday at 10:30 AM. Which works best?",
  },
  {
    sender: "user",
    text: "Thursday at 2 PM.",
  },
  {
    sender: "ai",
    text: "Perfect! You're booked for Thursday at 2:00 PM. You'll receive a confirmation by text shortly. Is there anything else I can help you with today?",
  },
];

export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const playConversation = () => {
      setMessages([]);
      setTyping(false);

      conversation.forEach((message, index) => {
        timeout = setTimeout(() => {
          if (message.sender === "ai") {
            setTyping(true);

            setTimeout(() => {
              setTyping(false);
              setMessages((prev) => [...prev, message]);
            }, 1200);
          } else {
            setMessages((prev) => [...prev, message]);
          }
        }, index * 2200);
      });

      setTimeout(
        playConversation,
        conversation.length * 2200 + 5000
      );
    };

    playConversation();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          sender={message.sender}
          text={message.text}
        />
      ))}

      {typing && <TypingIndicator />}
    </div>
  );
}