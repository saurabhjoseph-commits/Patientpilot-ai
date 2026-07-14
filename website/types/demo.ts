export type DemoStatus =
  | "draft"
  | "ready"
  | "presenting"
  | "completed";

export type PracticeType =
  | "General Dentistry"
  | "Pediatric"
  | "Orthodontics"
  | "Cosmetic"
  | "Oral Surgery";

export interface DemoProfile {
  id: string;

  practiceName: string;

  dentistName: string;

  city: string;

  website: string;

  logoUrl?: string;

  practiceType: PracticeType;

  officeHours?: string;

  services: string[];

  insurance: string[];

  status: DemoStatus;

  createdAt: string;

  updatedAt: string;
}

export interface DemoSession {
  id: string;

  profileId: string;

  startedAt: string;

  endedAt?: string;

  duration?: number;

  outcome?: string;

  notes?: string;
}

export interface ConversationScenario {
  id: string;

  title: string;

  category: string;

  duration: number;

  description: string;

  active: boolean;
}