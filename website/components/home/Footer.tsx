import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="PatientPilot AI"
              width={40}
              height={40}
            />

            <span className="text-xl font-bold">
              PatientPilot AI
            </span>
          </Link>

          <p className="mt-4 max-w-md text-slate-400">
            AI Receptionist built for modern dental practices. Never miss another patient call.
          </p>
        </div>

        <div className="flex gap-8">
          <Link href="/">Home</Link>
          <Link href="/solutions">Solutions</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/book-demo">Book Demo</Link>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © 2026 PatientPilot AI. All rights reserved.
      </div>
    </footer>
  );
}