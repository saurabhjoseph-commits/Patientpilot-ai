"use client";

import {
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import type {
  ClinicAISettings,
  ClinicBasicInfo,
  ClinicAddress,
  ClinicBusinessHours,
  ClinicContact,
} from "@/lib/clinic/models";
import type { ClinicOwnerAccount } from "@/lib/clinic/owner-account";

export interface ClinicReviewData {
  basicInfo: ClinicBasicInfo;
  address: ClinicAddress;
  contact: ClinicContact;
  businessHours: ClinicBusinessHours;
  aiSettings: ClinicAISettings;
  ownerAccount: ClinicOwnerAccount;
}

interface ClinicReviewStepProps {
  value: ClinicReviewData;
  submitting?: boolean;
  onBack: () => void;
  onCreate: () => void;
}

export default function ClinicReviewStep({
  value,
  submitting = false,
  onBack,
  onCreate,
}: ClinicReviewStepProps) {
  const enabledDays = Object.entries(
    value.businessHours,
  ).filter(([, day]) => day.enabled);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">
          Review Clinic
        </h2>

        <p className="mt-2 text-muted-foreground">
          Review the clinic configuration before creating the tenant.
        </p>
      </header>

      <ReviewCard
        icon={<Building2 className="h-5 w-5" />}
        title="Clinic Information"
      >
        <Item
          label="Clinic Name"
          value={value.basicInfo.name}
        />

        <Item
          label="Slug"
          value={value.basicInfo.slug}
        />

        <Item
          label="Status"
          value={value.basicInfo.status}
        />

        <Item
          label="Website"
          value={value.basicInfo.website || "-"}
        />

        <Item
          label="Email"
          value={value.basicInfo.email || "-"}
        />

        <Item
          label="Phone"
          value={value.basicInfo.phone || "-"}
        />
      </ReviewCard>

      <ReviewCard icon={<UserRound className="h-5 w-5" />} title="Owner account"><Item label="Owner" value={value.ownerAccount.fullName} /><Item label="Login email" value={value.ownerAccount.email} /><Item label="Role" value={value.ownerAccount.role} /><Item label="Activation email" value={value.ownerAccount.sendInvitation ? "Send now" : "Pending"} /></ReviewCard>

      <ReviewCard
        icon={<MapPin className="h-5 w-5" />}
        title="Address"
      >
        <Item
          label="Address"
          value={`${value.address.addressLine1} ${value.address.addressLine2}`.trim()}
        />

        <Item
          label="City"
          value={value.address.city}
        />

        <Item
          label="State"
          value={value.address.state}
        />

        <Item
          label="Postal Code"
          value={value.address.postalCode}
        />

        <Item
          label="Country"
          value={value.address.country}
        />

        <Item
          label="Timezone"
          value={value.address.timezone}
        />
      </ReviewCard>

      <ReviewCard
        icon={<Phone className="h-5 w-5" />}
        title="Contact Information"
      >
        <Item
          label="Primary Contact"
          value={value.contact.primaryContactName}
        />

        <Item
          label="Title"
          value={value.contact.primaryContactTitle}
        />

        <Item
          label="Email"
          value={value.contact.primaryEmail}
        />

        <Item
          label="Phone"
          value={value.contact.primaryPhone}
        />

        <Item
          label="Emergency Phone"
          value={value.contact.emergencyPhone || "-"}
        />
      </ReviewCard>

      <ReviewCard
        icon={<Clock className="h-5 w-5" />}
        title="Business Hours"
      >
        {enabledDays.length > 0 ? (
          enabledDays.map(([day, schedule]) => (
            <Item
              key={day}
              label={
                day.charAt(0).toUpperCase() +
                day.slice(1)
              }
              value={`${schedule.open} - ${schedule.close}`}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No business hours configured.
          </p>
        )}
      </ReviewCard>

      <ReviewCard
        icon={<Bot className="h-5 w-5" />}
        title="AI Configuration"
      >
        <Item
          label="AI Enabled"
          value={
            value.aiSettings.enabled
              ? "Yes"
              : "No"
          }
        />

        <Item
          label="Language"
          value={value.aiSettings.language}
        />

        <Item
          label="Voice"
          value={value.aiSettings.voice}
        />

        <Item
          label="Appointment Booking"
          value={
            value.aiSettings.appointmentBooking
              ? "Enabled"
              : "Disabled"
          }
        />

        <Item
          label="Appointment Cancellation"
          value={
            value.aiSettings.appointmentCancellation
              ? "Enabled"
              : "Disabled"
          }
        />

        <Item
          label="Appointment Rescheduling"
          value={
            value.aiSettings
              .appointmentRescheduling
              ? "Enabled"
              : "Disabled"
          }
        />

        <Item
          label="Human Handoff"
          value={
            value.aiSettings.humanHandoff
              ? "Enabled"
              : "Disabled"
          }
        />

        <Item
          label="After Hours"
          value={value.aiSettings.afterHoursMode}
        />

        <Item
          label="Call Recording"
          value={
            value.aiSettings.callRecording
              ? "Enabled"
              : "Disabled"
          }
        />

        <Item
          label="Transcript Storage"
          value={
            value.aiSettings.transcriptStorage
              ? "Enabled"
              : "Disabled"
          }
        />
      </ReviewCard>

      <div className="flex items-center justify-between border-t pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border px-5 py-2.5 font-medium transition hover:bg-muted"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onCreate}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CheckCircle2 className="h-4 w-4" />

          {submitting
            ? "Creating Clinic..."
            : "Create Clinic"}
        </button>
      </div>
    </section>
  );
}

interface ReviewCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ReviewCard({
  title,
  icon,
  children,
}: ReviewCardProps) {
  return (
    <section className="rounded-xl border bg-background">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        {icon}

        <h3 className="font-semibold">
          {title}
        </h3>
      </div>

      <div className="space-y-4 p-6">
        {children}
      </div>
    </section>
  );
}

interface ItemProps {
  label: string;
  value: string;
}

function Item({
  label,
  value,
}: ItemProps) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}
