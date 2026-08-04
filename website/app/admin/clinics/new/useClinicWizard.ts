"use client";

import { useMemo, useState } from "react";

import {
  CLINIC_WIZARD_STEPS,
  type ClinicWizardData,
  type ClinicWizardStep,
} from "./types";

import { DEFAULT_CLINIC_ADDRESS } from "@/lib/clinic/models/address";
import { DEFAULT_CLINIC_CONTACT } from "@/lib/clinic/models/contact";

export function useClinicWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string>();

  const [data, setData] = useState<ClinicWizardData>({
    basicInfo: {
      name: "",
      slug: "",
      email: "",
      phone: "",
      website: "",
      status: "draft",
    },

    address: DEFAULT_CLINIC_ADDRESS,

    contact: DEFAULT_CLINIC_CONTACT,

    businessHours: {
      monday: {
        enabled: true,
        open: "09:00",
        close: "17:00",
      },
      tuesday: {
        enabled: true,
        open: "09:00",
        close: "17:00",
      },
      wednesday: {
        enabled: true,
        open: "09:00",
        close: "17:00",
      },
      thursday: {
        enabled: true,
        open: "09:00",
        close: "17:00",
      },
      friday: {
        enabled: true,
        open: "09:00",
        close: "17:00",
      },
      saturday: {
        enabled: false,
        open: "",
        close: "",
      },
      sunday: {
        enabled: false,
        open: "",
        close: "",
      },
    },

    aiSettings: {
      enabled: true,

      language: "en-US",

      voice: "female-1",

      greeting: "",

      appointmentBooking: true,

      appointmentCancellation: true,

      appointmentRescheduling: true,

      humanHandoff: true,

      afterHoursMode: "take-message",

      callRecording: false,

      transcriptStorage: true,
    },
  });

  function updateBasicInfo(
    basicInfo: ClinicWizardData["basicInfo"],
  ) {
    setData((previous) => ({
      ...previous,
      basicInfo,
    }));
  }

  function updateAddress(
    address: ClinicWizardData["address"],
  ) {
    setData((previous) => ({
      ...previous,
      address,
    }));
  }

  function updateContact(
    contact: ClinicWizardData["contact"],
  ) {
    setData((previous) => ({
      ...previous,
      contact,
    }));
  }

  function updateBusinessHours(
    businessHours: ClinicWizardData["businessHours"],
  ) {
    setData((previous) => ({
      ...previous,
      businessHours,
    }));
  }

  function updateAISettings(
    aiSettings: ClinicWizardData["aiSettings"],
  ) {
    setData((previous) => ({
      ...previous,
      aiSettings,
    }));
  }

  function nextStep() {
    setCompletedSteps((previous) =>
      previous.includes(currentStep)
        ? previous
        : [...previous, currentStep],
    );

    setCurrentStep((previous) =>
      Math.min(previous + 1, CLINIC_WIZARD_STEPS.length - 1),
    );
  }

  function previousStep() {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 0),
    );
  }

  function goToStep(step: number) {
    if (
      step >= 0 &&
      step < CLINIC_WIZARD_STEPS.length
    ) {
      setCurrentStep(step);
    }
  }

  async function saveDraft() {
    try {
      setError(undefined);
      setIsSaving(true);

      // TODO:
      // Persist draft using ClinicOnboardingService

      await new Promise((resolve) =>
        setTimeout(resolve, 500),
      );
    } catch {
      setError("Unable to save draft.");
    } finally {
      setIsSaving(false);
    }
  }

  async function submit() {
    try {
      setError(undefined);
      setIsSubmitting(true);

      // TODO:
      // await ClinicOnboardingService.createClinic(data);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000),
      );
    } catch {
      setError("Unable to create clinic.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentStepId: ClinicWizardStep =
    CLINIC_WIZARD_STEPS[currentStep];

  const progress = useMemo(
    () =>
      Math.round(
        ((currentStep + 1) /
          CLINIC_WIZARD_STEPS.length) *
          100,
      ),
    [currentStep],
  );

  return {
    currentStep,

    currentStepId,

    completedSteps,

    progress,

    data,

    error,

    isSaving,

    isSubmitting,

    updateBasicInfo,

    updateAddress,

    updateContact,

    updateBusinessHours,

    updateAISettings,

    nextStep,

    previousStep,

    goToStep,

    saveDraft,

    submit,
  };
}
