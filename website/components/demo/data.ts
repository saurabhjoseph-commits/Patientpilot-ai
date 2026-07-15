// components/demo/data.ts

export interface DemoClinic {
  id: string;
  name: string;
  city: string;
  state: string;
  doctor: string;
  phone: string;
  email: string;
  monthlyCalls: number;
  monthlyRevenue: number;
  aiAnswerRate: number;
  patientSatisfaction: number;
  averageWaitSeconds: number;
}

export interface ExecutiveMetric {
  id: string;
  title: string;

  /**
   * Raw numeric value.
   * MetricCard will format it using
   * prefix/suffix/decimals.
   */
  value: number;

  change: string;

  trend: "up" | "down" | "neutral";

  icon: string;

  prefix?: string;

  suffix?: string;

  decimals?: number;
}

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description: string;
  status: "success" | "info" | "warning";
}

export const demoClinic: DemoClinic = {
  id: "bright-smile-dental",
  name: "Bright Smile Dental",
  city: "Phoenix",
  state: "Arizona",
  doctor: "Dr. Emily Carter",
  phone: "(602) 555-0148",
  email: "hello@brightsmiledental.com",
  monthlyCalls: 420,
  monthlyRevenue: 28490,
  aiAnswerRate: 99.2,
  patientSatisfaction: 98,
  averageWaitSeconds: 1.8,
};

export const executiveMetrics: ExecutiveMetric[] = [
  {
    id: "calls",
    title: "Calls Today",
    value: 42,
    change: "+18%",
    trend: "up",
    icon: "Phone",
  },

  {
    id: "appointments",
    title: "Appointments Booked",
    value: 15,
    change: "+31%",
    trend: "up",
    icon: "Calendar",
  },

  {
    id: "revenue",
    title: "Revenue Recovered",
    value: 8420,
    prefix: "$",
    change: "+22%",
    trend: "up",
    icon: "DollarSign",
  },

  {
    id: "answer-rate",
    title: "AI Answer Rate",
    value: 99.2,
    suffix: "%",
    decimals: 1,
    change: "Excellent",
    trend: "neutral",
    icon: "Bot",
  },

  {
    id: "wait-time",
    title: "Average Wait",
    value: 1.8,
    suffix: "s",
    decimals: 1,
    change: "-0.4s",
    trend: "up",
    icon: "Timer",
  },

  {
    id: "satisfaction",
    title: "Patient Satisfaction",
    value: 98,
    suffix: "%",
    change: "+2%",
    trend: "up",
    icon: "HeartHandshake",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    time: "10:01 AM",
    title: "Appointment Booked",
    description: "Sarah Johnson • Cleaning",
    status: "success",
  },
  {
    id: "2",
    time: "10:03 AM",
    title: "Insurance Verified",
    description: "Delta Dental",
    status: "info",
  },
  {
    id: "3",
    time: "10:05 AM",
    title: "Missed Call Recovered",
    description: "John Smith",
    status: "success",
  },
  {
    id: "4",
    time: "10:08 AM",
    title: "Emergency Visit Scheduled",
    description: "Michael Brown",
    status: "warning",
  },
];

export const revenueTrend = [
  { day: "Mon", revenue: 5200 },
  { day: "Tue", revenue: 6400 },
  { day: "Wed", revenue: 7100 },
  { day: "Thu", revenue: 6800 },
  { day: "Fri", revenue: 8420 },
];

export const aiPerformance = {
  intentDetection: 99,
  speechRecognition: 98,
  bookingAccuracy: 96,
  averageCallDuration: "2m 11s",
};

export const demoScenarios = [
  "New Patient",
  "Dental Emergency",
  "Insurance Question",
  "Appointment Booking",
  "Reschedule Visit",
  "Existing Patient",
];