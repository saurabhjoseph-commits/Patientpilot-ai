import Link from "next/link";

export default function CallCenterPage() {
  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Call Center
        </h1>
        <p className="mt-2 text-slate-600">
          Monitor live calls, conversations, and AI receptionist activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Active Calls</h2>
          <p className="mt-2 text-4xl font-bold">0</p>
          <p className="mt-2 text-sm text-slate-500">
            No active calls at the moment.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Today's Calls</h2>
          <p className="mt-2 text-4xl font-bold">0</p>
          <p className="mt-2 text-sm text-slate-500">
            Calls handled today.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="mt-2 text-4xl font-bold">0</p>
          <p className="mt-2 text-sm text-slate-500">
            Booked by the AI receptionist.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Live Conversation Feed
        </h2>

        <p className="mt-4 text-slate-500">
          Live calls and AI conversations will appear here after Twilio
          integration.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/admin"
          className="rounded-lg bg-cyan-600 px-5 py-3 font-medium text-white hover:bg-cyan-700"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}