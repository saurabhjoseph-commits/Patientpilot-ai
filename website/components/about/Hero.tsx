import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-slate-100 py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">

        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
          About PatientPilot AI
        </span>

        <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
          Helping Dental Practices
          <br />
          Never Miss Another Patient
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">
          PatientPilot AI was created to solve one of the biggest challenges
          dental practices face—missed patient calls. Our mission is to help
          clinics provide exceptional service, recover missed opportunities,
          and grow with the power of artificial intelligence.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Link
            href="/book-demo"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            Book a Free Demo
          </Link>

          <Link
            href="/solutions"
            className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Explore Solutions
          </Link>

        </div>

      </div>
    </section>
  );
}