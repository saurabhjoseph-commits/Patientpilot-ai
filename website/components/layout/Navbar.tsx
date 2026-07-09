"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="PatientPilot AI"
            width={190}
            height={60}
            priority
            className="h-14 w-auto transition duration-300 hover:scale-105"
          />
        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative font-medium text-slate-700 transition duration-300 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          <Link
            href="/book-demo"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Book Strategy Session

            <ArrowRight size={18} />
          </Link>
        </motion.div>

      </div>
    </header>
  );
}