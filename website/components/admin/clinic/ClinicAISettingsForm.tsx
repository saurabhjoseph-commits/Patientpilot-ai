"use client";

import { Bot } from "lucide-react";
import FormGrid from "@/components/ui/FormGrid";

export interface ClinicAISettings {
  enabled: boolean;
  language: string;
  voice: string;
  greeting: string;
  appointmentBooking: boolean;
  appointmentCancellation: boolean;
  appointmentRescheduling: boolean;
  humanHandoff: boolean;
  afterHoursMode: "voicemail" | "take-message" | "emergency-forward";
  callRecording: boolean;
  transcriptStorage: boolean;
}

interface ClinicAISettingsFormProps {
  value: ClinicAISettings;
  onChange: (value: ClinicAISettings) => void;
  disabled?: boolean;
}

export default function ClinicAISettingsForm({
  value,
  onChange,
  disabled = false,
}: ClinicAISettingsFormProps) {
  function update<K extends keyof ClinicAISettings>(
    key: K,
    fieldValue: ClinicAISettings[K],
  ) {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  }

  return (
    <section className="rounded-xl border bg-background p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
          <Bot className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            AI Front Office Settings
          </h2>

          <p className="text-sm text-muted-foreground">
            Configure how PatientPilot AI will interact with patients
            for this clinic.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* General */}
        <FormGrid>
          <SwitchRow
            title="Enable AI Receptionist"
            description="Allow PatientPilot AI to answer incoming calls."
            checked={value.enabled}
            disabled={disabled}
            onChange={(checked) => update("enabled", checked)}
          />

          <Field label="Language">
            <select
              value={value.language}
              disabled={disabled}
              onChange={(e) => update("language", e.target.value)}
              className={inputClass}
            >
              <option value="bilingual-auto">Bilingual Auto (English / Hindi / Hinglish)</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </Field>

          <Field label="Voice">
            <select
              value={value.voice}
              disabled={disabled}
              onChange={(e) => update("voice", e.target.value)}
              className={inputClass}
            >
              <option value="alloy">Alloy</option>
              <option value="female-1">Professional Female</option>
              <option value="female-2">Friendly Female</option>
              <option value="male-1">Professional Male</option>
              <option value="male-2">Friendly Male</option>
            </select>
          </Field>

          <Field label="Clinic Greeting">
            <input value={value.greeting} disabled={disabled} onChange={(e) => update("greeting", e.target.value)} placeholder="Welcome to our clinic." className={inputClass} />
          </Field>

          <Field label="After Hours">
            <select
              value={value.afterHoursMode}
              disabled={disabled}
              onChange={(e) =>
                update(
                  "afterHoursMode",
                  e.target.value as ClinicAISettings["afterHoursMode"],
                )
              }
              className={inputClass}
            >
              <option value="take-message">
                Take Message
              </option>

              <option value="voicemail">
                Send to Voicemail
              </option>

              <option value="emergency-forward">
                Forward Emergency Calls
              </option>
            </select>
          </Field>
        </FormGrid>

        {/* Capabilities */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            AI Capabilities
          </h3>

          <div className="space-y-4">
            <SwitchRow
              title="Book Appointments"
              description="Allow AI to create appointments."
              checked={value.appointmentBooking}
              disabled={disabled}
              onChange={(checked) =>
                update("appointmentBooking", checked)
              }
            />

            <SwitchRow
              title="Cancel Appointments"
              description="Allow AI to cancel appointments."
              checked={value.appointmentCancellation}
              disabled={disabled}
              onChange={(checked) =>
                update("appointmentCancellation", checked)
              }
            />

            <SwitchRow
              title="Reschedule Appointments"
              description="Allow AI to reschedule appointments."
              checked={value.appointmentRescheduling}
              disabled={disabled}
              onChange={(checked) =>
                update("appointmentRescheduling", checked)
              }
            />

            <SwitchRow
              title="Human Handoff"
              description="Transfer calls to clinic staff when required."
              checked={value.humanHandoff}
              disabled={disabled}
              onChange={(checked) =>
                update("humanHandoff", checked)
              }
            />
          </div>
        </div>

        {/* Compliance */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Recording & Compliance
          </h3>

          <div className="space-y-4">
            <SwitchRow
              title="Record Calls"
              description="Store call recordings."
              checked={value.callRecording}
              disabled={disabled}
              onChange={(checked) =>
                update("callRecording", checked)
              }
            />

            <SwitchRow
              title="Save Transcripts"
              description="Store conversation transcripts."
              checked={value.transcriptStorage}
              disabled={disabled}
              onChange={(checked) =>
                update("transcriptStorage", checked)
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({
  label,
  children,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {label}
      </span>

      {children}
    </label>
  );
}

interface SwitchRowProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function SwitchRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: SwitchRowProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div>
        <h4 className="font-medium">
          {title}
        </h4>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5"
      />
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border bg-background px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50";
