export interface Message {
  id: number;
  sender: "ai" | "patient";
  text: string;
  time: string;
}

export interface Appointment {
  patient: string;
  service: string;
  date: string;
  time: string;
}

export interface PhoneMockupProps {
  children: React.ReactNode;
}