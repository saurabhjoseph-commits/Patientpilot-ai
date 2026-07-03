import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="PatientPilot AI"
            width={160}
            height={55}
            className="h-18 w-auto"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/solutions"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Solutions
          </Link>

          <Link
            href="/pricing"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Pricing
          </Link>

          <Link
            href="/about"
            className="text-gray-700 transition hover:text-blue-600"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="/book-demo"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Book Demo
        </Link>

      </div>
    </header>
  );
}