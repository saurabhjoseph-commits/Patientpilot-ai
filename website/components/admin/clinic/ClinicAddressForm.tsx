"use client";

import { MapPin } from "lucide-react";
import FormGrid from "@/components/ui/FormGrid";

import type { ClinicAddress } from "@/lib/clinic/models/address";

interface ClinicAddressFormProps {
  value: ClinicAddress;
  onChange: (value: ClinicAddress) => void;
  disabled?: boolean;
}

const inputClass =
  "w-full rounded-lg border bg-background px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50";

export default function ClinicAddressForm({
  value,
  onChange,
  disabled = false,
}: ClinicAddressFormProps) {
  function update<K extends keyof ClinicAddress>(
    field: K,
    fieldValue: ClinicAddress[K],
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
          <MapPin className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Clinic Address
          </h2>

          <p className="text-sm text-muted-foreground">
            Enter the clinic's physical location and regional settings.
          </p>
        </div>
      </div>

      <FormGrid>
        <Field
          label="Address Line 1"
          required
        >
          <input
            type="text"
            value={value.addressLine1}
            disabled={disabled}
            onChange={(e) =>
              update("addressLine1", e.target.value)
            }
            placeholder="123 Main Street"
            className={inputClass}
          />
        </Field>

        <Field label="Address Line 2">
          <input
            type="text"
            value={value.addressLine2 ?? ""}
            disabled={disabled}
            onChange={(e) =>
              update("addressLine2", e.target.value)
            }
            placeholder="Suite 200"
            className={inputClass}
          />
        </Field>

        <Field
          label="City"
          required
        >
          <input
            type="text"
            value={value.city}
            disabled={disabled}
            onChange={(e) =>
              update("city", e.target.value)
            }
            placeholder="New York"
            className={inputClass}
          />
        </Field>

        <Field
          label="State / Province"
          required
        >
          <input
            type="text"
            value={value.state}
            disabled={disabled}
            onChange={(e) =>
              update("state", e.target.value)
            }
            placeholder="New York"
            className={inputClass}
          />
        </Field>

        <Field
          label="Postal Code"
          required
        >
          <input
            type="text"
            value={value.postalCode}
            disabled={disabled}
            onChange={(e) =>
              update("postalCode", e.target.value)
            }
            placeholder="10001"
            className={inputClass}
          />
        </Field>

        <Field
          label="Country"
          required
        >
          <input
            type="text"
            value={value.country}
            disabled={disabled}
            onChange={(e) =>
              update("country", e.target.value)
            }
            placeholder="United States"
            className={inputClass}
          />
        </Field>

        <div className="md:col-span-2">
          <Field
            label="Timezone"
            required
          >
            <input
              type="text"
              value={value.timezone}
              disabled={disabled}
              onChange={(e) =>
                update("timezone", e.target.value)
              }
              placeholder="America/New_York"
              className={inputClass}
            />
          </Field>
        </div>
      </FormGrid>
    </section>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({
  label,
  required,
  children,
}: FieldProps) {
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
