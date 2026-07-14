import {
  Building2,
  Phone,
  Bot,
  Clock,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

function status(value?: string) {
  return value ? "Configured" : "Missing";
}

function statusColor(value?: string) {
  return value
    ? "text-green-700 bg-green-100"
    : "text-red-700 bg-red-100";
}

export default async function SettingsPage() {
  const openAIConfigured = !!process.env.OPENAI_API_KEY;
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const twilioConfigured =
    !!process.env.TWILIO_ACCOUNT_SID &&
    !!process.env.TWILIO_AUTH_TOKEN &&
    !!process.env.TWILIO_PHONE_NUMBER;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Settings
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            System Configuration
          </h1>

          <p className="mt-2 text-slate-600">
            Review your PatientPilot AI
            configuration and integration
            status.
          </p>
        </div>

        {/* Clinic */}

        <Section
          title="Clinic"
          icon={<Building2 className="h-5 w-5" />}
        >
          <Row
            label="Clinic Name"
            value="PatientPilot Demo Clinic"
          />

          <Row
            label="Business Hours"
            value="Mon - Fri | 9:00 AM - 5:00 PM"
          />

          <Row
            label="Timezone"
            value="America/New_York"
          />
        </Section>

        {/* AI */}

        <Section
          title="OpenAI"
          icon={<Bot className="h-5 w-5" />}
        >
          <StatusRow
            label="API Key"
            status={status(openAIConfigured ? "ok" : "")}
            configured={openAIConfigured}
          />

          <Row
            label="Model"
            value={
              process.env.OPENAI_MODEL ??
              "gpt-5.5"
            }
          />

          <Row
            label="AI Version"
            value="Release Candidate RC2"
          />
        </Section>

        {/* Twilio */}

        <Section
          title="Twilio"
          icon={<Phone className="h-5 w-5" />}
        >
          <StatusRow
            label="Voice Integration"
            status={status(
              twilioConfigured ? "ok" : ""
            )}
            configured={twilioConfigured}
          />

          <Row
            label="Phone Number"
            value={
              process.env.TWILIO_PHONE_NUMBER ??
              "Not Configured"
            }
          />

          <Row
            label="Call Routing"
            value="/api/twilio/voice"
          />
        </Section>

        {/* Supabase */}

        <Section
          title="Database"
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <StatusRow
            label="Supabase"
            status={status(
              supabaseConfigured ? "ok" : ""
            )}
            configured={supabaseConfigured}
          />

          <Row
            label="Patients"
            value="Enabled"
          />

          <Row
            label="Appointments"
            value="Enabled"
          />

          <Row
            label="Call Summaries"
            value="Enabled"
          />
        </Section>

        {/* Notifications */}

        <Section
          title="Notifications"
          icon={<Bell className="h-5 w-5" />}
        >
          <Row
            label="Email Alerts"
            value="Enabled"
          />

          <Row
            label="SMS Alerts"
            value="Coming Soon"
          />
        </Section>

        {/* System */}

        <Section
          title="System"
          icon={<Clock className="h-5 w-5" />}
        >
          <Row
            label="Application"
            value="PatientPilot AI"
          />

          <Row
            label="Version"
            value="v1.0 RC2"
          />

          <Row
            label="Environment"
            value={
              process.env.NODE_ENV ??
              "production"
            }
          />
        </Section>

      </div>
    </main>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        {icon}

        <h2 className="text-xl font-semibold">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Row({
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

      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}

function StatusRow({
  label,
  status,
  configured,
}: {
  label: string;
  status: string;
  configured: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <span className="text-slate-600">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
          statusColor(
            configured ? "ok" : ""
          )
        }`}
      >
        {configured ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}

        {status}
      </span>
    </div>
  );
}