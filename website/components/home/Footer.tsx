import Link from "next/link";
import { Bot } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Book Demo", href: "/book-demo" },
] as const;

/** Shared marketing footer. It intentionally uses an HTML brand lockup because no transparent brand asset exists. */
export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-8 md:flex md:items-start md:justify-between md:gap-12 md:py-14">
        <div className="max-w-md">
          <Link
            href="/"
            aria-label="PatientPilot AI home"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/30">
              <Bot aria-hidden="true" className="h-6 w-6 text-white" />
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight text-white">PatientPilot <span className="text-blue-400">AI</span></span>
              <span className="mt-1 block text-[10px] font-semibold tracking-[0.16em] text-slate-300">AI RECEPTIONIST FOR DENTAL PRACTICES</span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-6 text-slate-300 sm:text-base">
            AI Receptionist built for modern dental practices. Never miss another patient call.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium md:mt-1 md:justify-end md:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-md px-1 py-2 text-slate-100 transition hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-700/70">
        <div className="mx-auto max-w-7xl px-6 py-7 text-sm text-slate-400 sm:px-8">
          © 2026 PatientPilot AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
