"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ClinicBasicInfoForm, { type ClinicBasicInfo } from "@/components/admin/clinic/ClinicBasicInfoForm";
import ClinicContactForm from "@/components/admin/clinic/ClinicContactForm";
import ClinicAddressForm from "@/components/admin/clinic/ClinicAddressForm";
import ClinicBusinessHoursForm from "@/components/admin/clinic/ClinicBusinessHoursForm";
import ClinicAISettingsForm from "@/components/admin/clinic/ClinicAISettingsForm";
import type { ClinicAISettings } from "@/components/admin/clinic/ClinicAISettingsForm";
import ClinicReviewStep from "@/components/admin/clinic/ClinicReviewStep";
import ClinicOwnerAccountForm from "@/components/admin/clinic/ClinicOwnerAccountForm";
import WizardStepper from "./WizardStepper";
import WizardNavigation from "./WizardNavigation";
import { INDIA_CLINIC_DEFAULTS, normalizeClinicSlug, type ClinicOnboardingPayload } from "@/lib/clinic/onboarding-contract";
import { DEFAULT_CLINIC_ADDRESS } from "@/lib/clinic/models/address";
import type { ClinicAddress } from "@/lib/clinic/models/address";
import { DEFAULT_CLINIC_CONTACT } from "@/lib/clinic/models/contact";
import { DEFAULT_CLINIC_BUSINESS_HOURS } from "@/lib/clinic/models/business-hours";
import { DEFAULT_CLINIC_OWNER_ACCOUNT } from "@/lib/clinic/owner-account";

const steps = ["Basic Information", "Contact", "Address", "Business Hours", "AI Settings", "Owner Account", "Review"];

export default function NewClinicWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState("");
  const [basic, setBasic] = useState<ClinicBasicInfo>({ name: "", slug: "", email: "", phone: "", website: "", status: "draft" });
  const [currency, setCurrency] = useState<string>(INDIA_CLINIC_DEFAULTS.currency);
  const [contact, setContact] = useState(DEFAULT_CLINIC_CONTACT);
  const [address, setAddress] = useState<ClinicAddress>({ ...DEFAULT_CLINIC_ADDRESS, country: INDIA_CLINIC_DEFAULTS.country, timezone: INDIA_CLINIC_DEFAULTS.timezone });
  const [businessHours, setBusinessHours] = useState(DEFAULT_CLINIC_BUSINESS_HOURS);
  const [aiSettings, setAiSettings] = useState<ClinicAISettings>({ enabled: true, language: INDIA_CLINIC_DEFAULTS.language, voice: "alloy", greeting: "", appointmentBooking: true, appointmentCancellation: true, appointmentRescheduling: true, humanHandoff: true, afterHoursMode: "take-message", callRecording: false, transcriptStorage: true });
  const [ownerAccount, setOwnerAccount] = useState(DEFAULT_CLINIC_OWNER_ACCOUNT);

  const next = () => { setError(""); setStep((current) => Math.min(current + 1, steps.length - 1)); };
  const submit = async () => {
    if (submitting) return;
    setSubmitting(true); setError("");
    const payload: ClinicOnboardingPayload = { name: basic.name, slug: normalizeClinicSlug(basic.slug || basic.name), country: address.country, timezone: address.timezone, currency, status: basic.status, email: basic.email || contact.primaryEmail, phone: basic.phone || contact.primaryPhone, ownerAccount, website: basic.website, addressLine1: address.addressLine1, addressLine2: address.addressLine2 ?? "", city: address.city, state: address.state, postalCode: address.postalCode, businessHours, aiSettings };
    const response = await fetch("/api/admin/clinics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result: unknown = await response.json().catch(() => ({}));
    if (!response.ok) { setError(typeof result === "object" && result && "message" in result && typeof result.message === "string" ? result.message : "Unable to create clinic."); setSubmitting(false); return; }
    const createdId = typeof result === "object" && result && "id" in result && typeof result.id === "string" ? result.id : "";
    router.replace(createdId ? `/admin/clinics/${createdId}` : "/admin/clinics?created=1"); router.refresh();
  };
  const content = [
    <div key="basic" className="space-y-4"><ClinicBasicInfoForm value={basic} onChange={setBasic} disabled={submitting} /><section className="rounded-xl border bg-background p-4 sm:p-6"><h2 className="font-semibold">Regional defaults</h2><div className="mt-4 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium">Country<input value={address.country} onChange={(event) => setAddress((current) => ({ ...current, country: event.target.value }))} disabled={submitting} className="mt-2 w-full rounded-lg border px-3 py-2" /></label><label className="text-sm font-medium">Timezone<input value={address.timezone} onChange={(event) => setAddress((current) => ({ ...current, timezone: event.target.value }))} disabled={submitting} className="mt-2 w-full rounded-lg border px-3 py-2" /></label><label className="text-sm font-medium">Currency<input value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} disabled={submitting} className="mt-2 w-full rounded-lg border px-3 py-2" /></label></div></section></div>,
    <ClinicContactForm key="contact" value={contact} onChange={setContact} disabled={submitting} />,
    <ClinicAddressForm key="address" value={address} onChange={setAddress} disabled={submitting} />,
    <ClinicBusinessHoursForm key="hours" value={businessHours} onChange={setBusinessHours} disabled={submitting} />,
    <ClinicAISettingsForm key="ai" value={aiSettings} onChange={setAiSettings} disabled={submitting} />,
    <ClinicOwnerAccountForm key="owner" value={ownerAccount} onChange={setOwnerAccount} disabled={submitting} />,
    <ClinicReviewStep key="review" value={{ basicInfo: basic, contact, address, businessHours, aiSettings, ownerAccount }} submitting={submitting} onBack={() => setStep(5)} onCreate={submit} />,
  ];
  return <section className="space-y-6"><WizardStepper currentStep={step} completedSteps={Array.from({ length: step }, (_, index) => index)} /><p className="text-sm font-medium text-blue-600">Step {step + 1} of 6 — {steps[step]}</p>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}{content[step]}{step < 5 && <WizardNavigation canGoBack={step > 0} canGoNext onBack={() => setStep((current) => Math.max(0, current - 1))} onNext={next} onSubmit={submit} canSubmit={false} loading={submitting} />}</section>;
}
