import Link from "next/link";

import {
  Bot,
  Activity,
  Cpu,
  MessageSquare,
  BrainCircuit,
  ShieldCheck,
  TerminalSquare,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const MODEL =
  process.env.OPENAI_MODEL ??
  "gpt-5.5";

const VERSION = "RC2";

export default async function AIPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Artificial Intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            AI Assistant Control Center
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor the health of PatientPilot AI,
            OpenAI integration, conversations,
            workflow engine and testing tools.
          </p>
        </div>

        {/* Status */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <Card
            title="AI Status"
            value="Online"
            subtitle="Ready"
            icon={<Bot className="h-6 w-6" />}
            color="bg-green-100 text-green-700"
          />

          <Card
            title="Model"
            value={MODEL}
            subtitle="OpenAI"
            icon={<BrainCircuit className="h-6 w-6" />}
            color="bg-blue-100 text-blue-700"
          />

          <Card
            title="Workflow"
            value="Healthy"
            subtitle="Conversation Engine"
            icon={<Activity className="h-6 w-6" />}
            color="bg-purple-100 text-purple-700"
          />

          <Card
            title="Version"
            value={VERSION}
            subtitle="Release Candidate"
            icon={<ShieldCheck className="h-6 w-6" />}
            color="bg-amber-100 text-amber-700"
          />

        </div>

        {/* System Information */}

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">
              AI Engine
            </h2>

            <div className="space-y-4">

              <InfoRow
                label="Conversation Engine"
                value="Active"
              />

              <InfoRow
                label="Workflow"
                value="Conversation → Appointment → Patient → Summary"
              />

              <InfoRow
                label="Developer Console"
                value="Enabled"
              />

              <InfoRow
                label="OpenAI"
                value="Connected"
              />

              <InfoRow
                label="Twilio"
                value="Configured"
              />

            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-semibold">
              AI Features
            </h2>

            <div className="space-y-4">

              <Feature
                title="Appointment Booking"
                enabled
              />

              <Feature
                title="Patient CRM Sync"
                enabled
              />

              <Feature
                title="Call Summaries"
                enabled
              />

              <Feature
                title="Developer Simulator"
                enabled
              />

              <Feature
                title="Structured AI Engine"
                enabled={false}
              />

            </div>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold">
            AI Tools
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <ActionCard
              title="Developer Console"
              description="Test complete AI conversations."
              href="/admin/test-console"
              icon={<TerminalSquare className="h-6 w-6" />}
            />

            <ActionCard
              title="Call Center"
              description="Monitor active AI calls."
              href="/admin/call-center"
              icon={<MessageSquare className="h-6 w-6" />}
            />

            <ActionCard
              title="Live Dashboard"
              description="View live conversations."
              href="/admin/live"
              icon={<Cpu className="h-6 w-6" />}
            />

          </div>

        </div>

      </div>
    </main>
  );
}

function Card({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {value}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          {icon}
        </div>

      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <span className="text-slate-600">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function Feature({
  title,
  enabled,
}: {
  title: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">

      <span>{title}</span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          enabled
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {enabled ? "Enabled" : "Coming Soon"}
      </span>

    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border bg-slate-50 p-5 transition hover:border-blue-500 hover:bg-white"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600">
        Open
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}