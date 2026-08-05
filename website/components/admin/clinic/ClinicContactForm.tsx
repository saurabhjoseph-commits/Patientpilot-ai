"use client";

import { Phone, Mail, User, AlertCircle } from "lucide-react";
import FormGrid from "@/components/ui/FormGrid";

import type { ClinicContact } from "@/lib/clinic/models/contact";

interface ClinicContactFormProps {
  value: ClinicContact;
  onChange: (value: ClinicContact) => void;
  disabled?: boolean;
}

const inputClass =
  "w-full rounded-lg border bg-background px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50";

export default function ClinicContactForm({
  value,
  onChange,
  disabled = false,
}: ClinicContactFormProps) {
  function update<K extends keyof ClinicContact>(
    field: K,
    fieldValue: ClinicContact[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <section className="rounded-xl border bg-background p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
          <Phone className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Contact Information
          </h2>

          <p className="text-sm text-muted-foreground">
            Configure the primary business contact details used for clinic
            administration, patient communication, and notifications.
          </p>
        </div>
      </div>

      <FormGrid>
        <InputField
          label="Primary Contact"
          required
          icon={<User className="h-4 w-4" />}
        >
          <input
            type="text"
            value={value.primaryContactName}
            disabled={disabled}
            onChange={(e) =>
              update("primaryContactName", e.target.value)
            }
            placeholder="Dr. Sarah Johnson"
            className={inputClass}
          />
        </InputField>

        <InputField
          label="Job Title"
          icon={<User className="h-4 w-4" />}
        >
          <input
            type="text"
            value={value.primaryContactTitle}
            disabled={disabled}
            onChange={(e) =>
              update("primaryContactTitle", e.target.value)
            }
            placeholder="Practice Owner"
            className={inputClass}
          />
        </InputField>

        <InputField
          label="Business Email"
          required
          icon={<Mail className="h-4 w-4" />}
        >
          <input
            type="email"
            value={value.primaryEmail}
            disabled={disabled}
            onChange={(e) =>
              update("primaryEmail", e.target.value)
            }
            placeholder="office@clinic.com"
            className={inputClass}
          />
        </InputField>

        <InputField
          label="Business Phone"
          required
          icon={<Phone className="h-4 w-4" />}
        >
          <input
            type="tel"
            value={value.primaryPhone}
            disabled={disabled}
            onChange={(e) =>
              update("primaryPhone", e.target.value)
            }
            placeholder="+1 (555) 123-4567"
            className={inputClass}
          />
        </InputField>

        <InputField
          label="Emergency Phone"
          icon={<AlertCircle className="h-4 w-4" />}
        >
          <input
            type="tel"
            value={value.emergencyPhone ?? ""}
            disabled={disabled}
            onChange={(e) =>
              update("emergencyPhone", e.target.value)
            }
            placeholder="+1 (555) 987-6543"
            className={inputClass}
          />
        </InputField>
      </FormGrid>
    </section>
  );
}

interface InputFieldProps {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function InputField({
  label,
  required,
  icon,
  children,
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}

        {required && (
          <span className="text-red-500">*</span>
        )}
      </span>

      {children}
    </label>
  );
}
