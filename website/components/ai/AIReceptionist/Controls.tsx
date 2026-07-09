"use client";

import { Mic, PhoneOff, Volume2 } from "lucide-react";

interface ControlsProps {
  onEnd: () => void;
}

export default function Controls({
  onEnd,
}: ControlsProps) {
  return (
    <div className="border-t bg-white p-5">
      <div className="flex items-center justify-center gap-8">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200">
          <Mic size={22} />
        </button>

        <button
          onClick={onEnd}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600"
        >
          <PhoneOff size={26} />
        </button>

        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200">
          <Volume2 size={22} />
        </button>
      </div>
    </div>
  );
}