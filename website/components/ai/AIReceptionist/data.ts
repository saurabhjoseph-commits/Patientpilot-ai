import { Message } from "./types";

export const conversation: Message[] = [
  {
    id: 1,
    sender: "patient",
    text: "Hi, I'd like to book a teeth cleaning appointment.",
    delay: 1000,
  },
  {
    id: 2,
    sender: "ai",
    text: "Absolutely! I'd be happy to help. May I have your full name?",
    delay: 1800,
  },
  {
    id: 3,
    sender: "patient",
    text: "John Smith.",
    delay: 1200,
  },
  {
    id: 4,
    sender: "ai",
    text: "Thank you, John. We have availability this Thursday at 2:00 PM or Friday at 10:30 AM. Which works best for you?",
    delay: 2800,
  },
  {
    id: 5,
    sender: "patient",
    text: "Thursday at 2 PM.",
    delay: 1200,
  },
  {
    id: 6,
    sender: "ai",
    text: "Perfect! Your appointment has been successfully booked for Thursday at 2:00 PM. You'll receive a confirmation by SMS and email shortly. We look forward to seeing you. Have a wonderful day!",
    delay: 4500,
  },
];