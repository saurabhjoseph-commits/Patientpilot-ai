"use client";

import {
  CheckCircle2,
  CalendarDays,
  Clock,
  User,
} from "lucide-react";

interface Props {
  patientName: string;
  service: string;
  date: string;
  time: string;
  onRestart: () => void;
}

export default function AppointmentCard({
  patientName,
  service,
  date,
  time,
  onRestart,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-gradient-to-b from-cyan-50 to-white p-6">
      <div className="my-auto text-center">
        <CheckCircle2
          className="mx-auto mb-5 text-green-500"
          size={72}
        />

        <h2 className="text-4xl font-bold text-slate-900">
          Appointment Confirmed
        </h2>

        <p className="mt-3 text-slate-500">
          Your appointment has been successfully booked.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <User className="text-cyan-600" />
            <span>{patientName}</span>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <CalendarDays className="text-cyan-600" />
            <span>{service}</span>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <CalendarDays className="text-cyan-600" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-cyan-600" />
            <span>{time}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="mt-8 rounded-2xl bg-cyan-600 px-8 py-4 font-semibold text-white transition hover:bg-cyan-700"
        >
          Start Another Demo
        </button>
      </div>
    </div>
  );
}