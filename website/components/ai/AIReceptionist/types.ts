export type CallState =
  | "idle"
  | "ringing"
  | "conversation"
  | "confirmed";

export interface Message {
  id: number;
  sender: "ai" | "patient";
  text: string;
  delay?: number;
}

export interface MessageBubbleProps {
  message: Message;
  speaking?: boolean;
}