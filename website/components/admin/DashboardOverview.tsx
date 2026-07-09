import { Bot } from "lucide-react";

interface DashboardOverviewProps {
  aiCallsToday: number;
}

export default function DashboardOverview({
  aiCallsToday,
}: DashboardOverviewProps) {
  return (
    <section className="mb-10 rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side */}
        <div>
          <p className="text-cyan-100 text-lg">
            👋 Welcome Back
          </p>

          <h1 className="mt-3 text-5xl font-bold">
            PatientPilot AI Dashboard
          </h1>

          <p className="mt-4 text-cyan-100">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-cyan-50">
            Monitor your AI Receptionist, appointments,
            leads and revenue from one centralized
            dashboard.
          </p>
        </div>

        {/* Right Side */}
        <div className="rounded-3xl bg-white/15 p-6 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-green-300 opacity-75"></span>

              <span className="relative inline-flex h-5 w-5 rounded-full bg-green-400"></span>
            </div>

            <div>
              <p className="text-sm text-cyan-100">
                AI Receptionist
              </p>

              <h3 className="text-2xl font-bold">
                Online
              </h3>
            </div>
          </div>

          <div className="mt-8 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8" />

              <div>
                <p className="text-sm text-cyan-100">
                  AI Calls Today
                </p>

                <h2 className="text-5xl font-bold">
                  {aiCallsToday}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}