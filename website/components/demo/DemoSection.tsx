"use client";

import PhoneMockup from "./PhoneMockup";

export default function DemoSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto flex max-w-7xl justify-center px-6">
        <PhoneMockup>
          <div className="flex h-full items-center justify-center text-2xl font-bold text-white">
            📱 Phone Working
          </div>
        </PhoneMockup>
      </div>
    </section>
  );
}