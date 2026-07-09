"use client";

import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({
  children,
}: PhoneFrameProps) {
  return (
    <div className="mx-auto w-[340px] rounded-[42px] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
      {/* Dynamic Island */}
      <div className="relative">
        <div className="absolute left-1/2 top-3 z-20 h-7 w-32 -translate-x-1/2 rounded-full bg-black" />
      </div>

      {/* Screen */}
      <div className="mt-4 flex h-[620px] flex-col overflow-hidden rounded-[34px] bg-gradient-to-b from-cyan-50 to-white">
        {children}
      </div>
    </div>
  );
}