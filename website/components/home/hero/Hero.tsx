"use client";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroDashboard from "./HeroDashboard";
import FloatingStats from "./FloatingStats";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 pt-16 pb-20 lg:pt-20 lg:pb-24">
      {/* Animated Background */}
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left Side */}
          <HeroContent />

          {/* Right Side */}
          <div className="relative flex justify-center lg:justify-end">
            <FloatingStats />

            <div className="relative z-10 w-full max-w-2xl">
              <HeroDashboard />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}