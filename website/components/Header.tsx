"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:bg-white/90 md:shadow-none md:backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex h-full items-center overflow-hidden" aria-label="PatientPilot AI home">
          <Image
            src="/images/patientpilot-logo.png"
            alt="PatientPilot AI"
            width={350}
            height={120}
            priority
            className="h-12 w-auto object-contain md:h-20"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-slate-700 hover:text-blue-600 transition font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            Book Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-white text-blue-950 shadow-sm transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white shadow-lg md:hidden">
          <nav className="flex flex-col p-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 text-slate-800 transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 min-h-12 rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Book Demo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
