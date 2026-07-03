import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="mx-auto max-w-5xl px-6 text-center text-white">
        <h2 className="text-4xl font-bold">
          Ready to Stop Missing Patient Calls?
        </h2>

        <p className="mt-6 text-xl text-blue-100">
          Book a free strategy session and discover how PatientPilot AI can
          answer calls, schedule appointments, and grow your dental practice
          24/7.
        </p>

        <Link
          href="/book-demo"
          className="mt-10 inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition hover:bg-slate-100"
        >
          Book Your Free Demo
        </Link>
      </div>
    </section>
  );
}