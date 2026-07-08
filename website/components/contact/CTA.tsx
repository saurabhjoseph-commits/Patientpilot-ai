import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-24">
      <div className="mx-auto max-w-5xl px-6 text-center text-white">

        <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
          Let's Talk
        </span>

        <h2 className="mt-8 text-5xl font-extrabold">
          Ready to Modernize
          <br />
          Your Dental Practice?
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-blue-100">
          Book a free strategy session and discover how PatientPilot AI can
          help your practice answer more calls, book more appointments, and
          deliver a better patient experience.
        </p>

        <Link
          href="/book-demo"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 transition hover:bg-slate-100"
        >
          Book Your Free Demo
          <ArrowRight size={20} />
        </Link>

      </div>
    </section>
  );
}