import type { ClinicBasicInfo } from "@/components/admin/clinic/ClinicBasicInfoForm";
import type { ClinicAddress } from "@/lib/clinic/models/address";
import type { ClinicContact } from "@/lib/clinic/models/contact";
import type { ClinicBusinessHours } from "@/components/admin/clinic/ClinicBusinessHoursForm";
import type { ClinicAISettings } from "@/components/admin/clinic/ClinicAISettingsForm";

export const CLINIC_WIZARD_STEPS = [
  "basic-info",
  "address",
  "contact",
  "business-hours",
  "ai-settings",
  "review",
] as const;

export type ClinicWizardStep =
  (typeof CLINIC_WIZARD_STEPS)[number];

export interface ClinicWizardStepDefinition {
  id: ClinicWizardStep;
  title: string;
  description: string;
}

export const CLINIC_WIZARD_STEP_DEFINITIONS: ClinicWizardStepDefinition[] =
  [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Clinic identity and business details.",
    },
    {
      id: "address",
      title: "Address",
      description: "Location, timezone and regional settings.",
    },
    {
      id: "contact",
      title: "Contact",
      description: "Primary clinic contact information.",
    },
    {
      id: "business-hours",
      title: "Business Hours",
      description: "Configure operating schedule.",
    },
    {
      id: "ai-settings",
      title: "AI Settings",
      description: "PatientPilot AI configuration.",
    },
    {
      id: "review",
      title: "Review",
      description: "Review and create the clinic.",
    },
  ];

export interface ClinicWizardData {
  basicInfo: ClinicBasicInfo;
  address: ClinicAddress;
  contact: ClinicContact;
  businessHours: ClinicBusinessHours;
  aiSettings: ClinicAISettings;
}

export interface ClinicWizardValidation {
  basicInfo: boolean;
  address: boolean;
  contact: boolean;
  businessHours: boolean;
  aiSettings: boolean;
  review: boolean;
}

export interface ClinicWizardState {
  currentStep: number;
  completedSteps: number[];
  data: ClinicWizardData;
  validation: ClinicWizardValidation;
  isSaving: boolean;
  isSubmitting: boolean;
  error?: string;
}

export interface WizardNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  canSubmit: boolean;
  loading?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  onSubmit: () => void;
}

export interface WizardStepperProps {
  currentStep: number;
  completedSteps: number[];
}