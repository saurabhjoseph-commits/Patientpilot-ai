import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-6 py-24">
          <h1 className="text-5xl font-bold text-slate-900">
            Never Miss Another Patient Call Again.
          </h1>

          <p className="mt-6 text-xl text-slate-600">
            PatientPilot AI helps dental practices answer calls, recover missed
            appointments, automate follow-ups, and grow their practice with AI.
          </p>
        </section>
      </main>
    </>
  );
}