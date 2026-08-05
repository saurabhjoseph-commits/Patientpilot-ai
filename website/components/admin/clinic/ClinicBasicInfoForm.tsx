"use client";

import { Building2 } from "lucide-react";
import FormGrid from "@/components/ui/FormGrid";

export interface ClinicBasicInfo {
  name: string;
  slug: string;
  email: string;
  phone: string;
  website: string;
  status: "draft" | "active" | "inactive";
}

interface ClinicBasicInfoFormProps {
  value: ClinicBasicInfo;
  onChange: (value: ClinicBasicInfo) => void;
  disabled?: boolean;
}

export default function ClinicBasicInfoForm({
  value,
  onChange,
  disabled = false,
}: ClinicBasicInfoFormProps) {
  function update<K extends keyof ClinicBasicInfo>(
    field: K,
    fieldValue: ClinicBasicInfo[K],
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
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Basic Clinic Information
          </h2>

          <p className="text-sm text-muted-foreground">
            Enter the core information required to create a new clinic.
          </p>
        </div>
      </div>

      <FormGrid>
        <FormField
          label="Clinic Name"
          required
        >
          <input
            type="text"
            value={value.name}
            disabled={disabled}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Bright Smile Dental"
            className="w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </FormField>

        <FormField
          label="Clinic Slug"
          required
        >
          <input
            type="text"
            value={value.slug}
            disabled={disabled}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="bright-smile-dental"
            className="w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            value={value.email}
            disabled={disabled}
            onChange={(e) => update("email", e.target.value)}
            placeholder="contact@clinic.com"
            className="w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </FormField>

        <FormField label="Phone">
          <input
            type="tel"
            value={value.phone}
            disabled={disabled}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </FormField>

        <FormField label="Website">
          <input
            type="url"
            value={value.website}
            disabled={disabled}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </FormField>

        <FormField label="Status">
          <select
            value={value.status}
            disabled={disabled}
            onChange={(e) =>
              update(
                "status",
                e.target.value as ClinicBasicInfo["status"],
              )
            }
            className="w-full rounded-lg border bg-background px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FormField>
      </FormGrid>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  required,
  children,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      {children}
    </label>
  );
}
