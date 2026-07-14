import DeveloperConsole from "@/components/admin/test-console/DeveloperConsole";

export const metadata = {
  title: "Developer Test Console | PatientPilot AI",
  description:
    "Internal developer console for testing the PatientPilot AI workflow.",
};

export default function TestConsolePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Internal Tool
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            PatientPilot AI Developer Test Console
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Simulate real patient conversations without using Twilio.
            This console will execute the same AI workflow used during
            production phone calls and display conversation state,
            appointments, patient records, and AI summaries.
          </p>
        </div>

        <DeveloperConsole />
      </div>
    </main>
  );
}