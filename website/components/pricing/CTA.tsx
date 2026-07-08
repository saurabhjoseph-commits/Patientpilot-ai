import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-24">
      <div className="mx-auto max-w-5xl px-6 text-center text-white">

        <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
          Let's Grow Your Practice Together
        </span>

        <h2 className="mt-8 text-5xl font-extrabold leading-tight">
          Ready to Stop Missing
          <br />
          Patient Calls?
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-blue-100">
          Discover how PatientPilot AI can answer every patient call,
          automate appointment scheduling, recover missed opportunities,
          and help your dental practice grow with confidence.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Link
            href="/book-demo"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 transition hover:bg-slate-100"
          >
            Book Your Free Demo
            <ArrowRight size={20} />
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-blue-700"
          >
            Contact Us
          </Link>

        </div>

      </div>
    </section>
  );
}