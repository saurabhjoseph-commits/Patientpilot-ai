import Link from "next/link";
import { DollarSign, TrendingUp, PhoneCall } from "lucide-react";

export default function ROI() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Return on Investment
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            One New Patient Can Pay for Your Subscription
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            PatientPilot AI isn't just another software expense—it's designed
            to help you recover missed opportunities and grow your practice.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          <div className="rounded-3xl bg-slate-50 p-8 shadow-lg">
            <PhoneCall className="h-12 w-12 text-blue-600" />

            <h3 className="mt-6 text-2xl font-bold">
              25 Missed Calls
            </h3>

            <p className="mt-4 text-slate-600">
              A typical clinic may miss around 25 patient calls each month due
              to busy staff or after-hours inquiries.
            </p>
          </div>

          <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
            <DollarSign className="h-12 w-12" />

            <h3 className="mt-6 text-2xl font-bold">
              $450 Average Treatment
            </h3>

            <p className="mt-4 text-blue-100">
              If just a few missed callers become patients, the additional
              treatment revenue can quickly outweigh the subscription cost.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8 shadow-lg">
            <TrendingUp className="h-12 w-12 text-green-600" />

            <h3 className="mt-6 text-2xl font-bold">
              Grow with Confidence
            </h3>

            <p className="mt-4 text-slate-600">
              PatientPilot AI helps you capture more opportunities while your
              team focuses on delivering excellent patient care.
            </p>
          </div>

        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-center text-white">

          <h3 className="text-3xl font-bold">
            Ready to See the Results for Your Practice?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Every practice is different. Book a free demo and we'll show you
            how PatientPilot AI can fit into your workflow.
          </p>

          <Link
            href="/book-demo"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-slate-100"
          >
            Book Your Free Demo
          </Link>

        </div>

      </div>
    </section>
  );
}