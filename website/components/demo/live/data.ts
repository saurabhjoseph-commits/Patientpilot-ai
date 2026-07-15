// components/demo/live/data.ts

import type { DemoScenario } from "./types";

export const defaultScenario: DemoScenario = {
  id: "new-patient",

  title: "New Patient Appointment",

  description:
    "A new patient calls Bright Smile Dental to schedule a routine cleaning.",

  patientName: "Sarah Johnson",

  callerPhone: "(480) 555-0182",

  messages: [
    {
      id: "1",
      speaker: "system",
      text: "Incoming call from Sarah Johnson",
      timestamp: "10:01 AM",
      delay: 1200,
    },
    {
      id: "2",
      speaker: "ai",
      text:
        "Thank you for calling Bright Smile Dental. This is PatientPilot AI. How may I help you today?",
      timestamp: "10:01 AM",
      delay: 2200,
      typing: true,
    },
    {
      id: "3",
      speaker: "patient",
      text:
        "Hi, I'm a new patient and I'd like to schedule a dental cleaning sometime next week.",
      timestamp: "10:01 AM",
      delay: 2600,
    },
    {
      id: "4",
      speaker: "ai",
      text:
        "Absolutely! We'd love to welcome you. May I have your full name, please?",
      timestamp: "10:02 AM",
      delay: 2000,
      typing: true,
    },
    {
      id: "5",
      speaker: "patient",
      text: "Sarah Johnson.",
      timestamp: "10:02 AM",
      delay: 1400,
    },
    {
      id: "6",
      speaker: "ai",
      text:
        "Thank you, Sarah. Do you have dental insurance you'd like us to use?",
      timestamp: "10:02 AM",
      delay: 2200,
      typing: true,
    },
    {
      id: "7",
      speaker: "patient",
      text: "Yes, I have Delta Dental.",
      timestamp: "10:03 AM",
      delay: 1600,
    },
    {
      id: "8",
      speaker: "ai",
      text:
        "Perfect. I have an appointment available with Dr. Emily Carter on Tuesday at 10:30 AM. Would that work for you?",
      timestamp: "10:03 AM",
      delay: 2600,
      typing: true,
    },
    {
      id: "9",
      speaker: "patient",
      text: "Yes, that's perfect.",
      timestamp: "10:04 AM",
      delay: 1400,
    },
    {
      id: "10",
      speaker: "ai",
      text:
        "You're all set! Your appointment has been scheduled for Tuesday at 10:30 AM. A confirmation has been sent via SMS and email. We look forward to seeing you, Sarah!",
      timestamp: "10:04 AM",
      delay: 3200,
      typing: true,
    },
  ],

  analysis: {
    intent: "New Patient Appointment",
    confidence: 99,
    insurance: "Delta Dental",
    procedure: "Routine Cleaning",
    urgency: "Medium",
    nextAction: "Book Appointment",
    sentiment: "Positive",
  },

  appointment: {
    patientName: "Sarah Johnson",
    dentist: "Dr. Emily Carter",
    procedure: "Routine Cleaning",
    date: "Tuesday",
    time: "10:30 AM",
    confirmationSent: true,
  },

  crmEvents: [
    {
      id: "crm-1",
      title: "Lead Created",
      description: "New patient record added to CRM.",
      completed: true,
      timestamp: "10:01 AM",
    },
    {
      id: "crm-2",
      title: "Insurance Captured",
      description: "Delta Dental recorded.",
      completed: true,
      timestamp: "10:03 AM",
    },
    {
      id: "crm-3",
      title: "Appointment Scheduled",
      description: "Cleaning booked with Dr. Emily Carter.",
      completed: true,
      timestamp: "10:04 AM",
    },
    {
      id: "crm-4",
      title: "Confirmation Sent",
      description: "SMS and email confirmation delivered.",
      completed: true,
      timestamp: "10:04 AM",
    },
  ],
};

/**
 * Master list of demo scenarios
 */
export const scenarios: DemoScenario[] = [
  defaultScenario,

  {
    ...defaultScenario,
    id: "emergency",
    title: "Dental Emergency",
    description:
      "A patient with severe tooth pain needs immediate care.",
  },

  {
    ...defaultScenario,
    id: "insurance",
    title: "Insurance Question",
    description:
      "Patient calls to verify insurance coverage.",
  },

  {
    ...defaultScenario,
    id: "existing-patient",
    title: "Existing Patient",
    description:
      "Returning patient scheduling a follow-up visit.",
  },

  {
    ...defaultScenario,
    id: "recall",
    title: "Recall Reminder",
    description:
      "AI reaches out to schedule an overdue cleaning.",
  },

  {
    ...defaultScenario,
    id: "reschedule",
    title: "Reschedule Appointment",
    description:
      "Patient changes an existing appointment.",
  },

  {
    ...defaultScenario,
    id: "cosmetic",
    title: "Cosmetic Consultation",
    description:
      "Patient is interested in veneers and whitening.",
  },
];

/**
 * Backward compatibility
 *
 * Older components still import demoScenarios.
 * RC1 components import scenarios.
 * Both now point to the same array.
 */
export const demoScenarios = scenarios;