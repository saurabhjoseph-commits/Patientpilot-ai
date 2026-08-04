/**
 * PP-002 Milestone A
 * Global Location Domain
 *
 * Represents a physical clinic location.
 * A clinic can have one or many locations.
 */

export type LocationStatus =
  | "active"
  | "inactive"
  | "temporary_closed";

export interface LocationAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;

  latitude?: number;
  longitude?: number;
}

export interface LocationContact {
  phone: string;
  email?: string;
}

export interface WorkingHours {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  isOpen: boolean;

  openTime?: string;

  closeTime?: string;

  breaks?: {
    start: string;
    end: string;
  }[];
}

export interface EmergencyHours {
  enabled: boolean;

  phone?: string;

  instructions?: string;
}

export interface LocationFeatures {
  wheelchairAccessible: boolean;

  parkingAvailable: boolean;

  acceptsWalkIns: boolean;

  emergencyAppointments: boolean;

  pediatricServices: boolean;
}

export interface Location {

  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  code: string;

  status: LocationStatus;

  address: LocationAddress;

  contact: LocationContact;

  timezone: string;

  workingHours: WorkingHours[];

  emergencyHours: EmergencyHours;

  features: LocationFeatures;

  createdAt: string;

  updatedAt: string;

}