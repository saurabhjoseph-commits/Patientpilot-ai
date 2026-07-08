import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-24">
      <div className="mx-auto max-w-5xl px-6 text-center text-white">

        <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
          Ready to Transform Your Practice?
        </span>

        <h2 className="mt-8 text-5xl font-extrabold">
          Never Miss Another
          <br />
          Patient Opportunity
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-blue-100">
          Join modern dental practices using PatientPilot AI to answer every
          call, automate scheduling, recover missed opportunities, and
          deliver an exceptional patient experience.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <Link
            href="/book-demo"
            className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 transition hover:bg-slate-100"
          >
            Book Your Free Demo
            <ArrowRight size={20} />
          </Link>

          <Link
            href="/pricing"
            className="rounded-xl border border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-blue-700"
          >
            View Pricing
          </Link>

        </div>

        <div className="mt-12 grid gap-8 text-center md:grid-cols-3">

          <div>
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="mt-2 text-blue-100">
              AI Receptionist
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">98%</h3>
            <p className="mt-2 text-blue-100">
              Calls Answered
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">35%</h3>
            <p className="mt-2 text-blue-100">
              More Appointments
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}