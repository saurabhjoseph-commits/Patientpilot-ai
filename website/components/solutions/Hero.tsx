import Link from "next/link";
import { Bot, PhoneCall, CalendarCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-slate-100 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            Solutions for Modern Dental Practices
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            AI Receptionist That
            <br />
            Never Misses
            <br />
            Another Patient Call
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">
            PatientPilot AI answers every call, books appointments,
            follows up with missed callers, and helps your dental
            practice grow while your staff focuses on delivering
            exceptional patient care.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/book-demo"
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              Book Free Demo
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View Pricing
            </Link>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <Bot className="mx-auto h-12 w-12 text-blue-600" />

              <h3 className="mt-6 text-xl font-bold">
                AI Receptionist
              </h3>

              <p className="mt-4 text-slate-600">
                Friendly AI answers every patient call professionally.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <PhoneCall className="mx-auto h-12 w-12 text-blue-600" />

              <h3 className="mt-6 text-xl font-bold">
                Never Miss Calls
              </h3>

              <p className="mt-4 text-slate-600">
                Recover missed opportunities even after office hours.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <CalendarCheck className="mx-auto h-12 w-12 text-blue-600" />

              <h3 className="mt-6 text-xl font-bold">
                Automatic Booking
              </h3>

              <p className="mt-4 text-slate-600">
                AI schedules appointments directly into your calendar.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}