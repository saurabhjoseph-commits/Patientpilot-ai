/**
 * PP-003 Operations Domain
 *
 * Represents the clinical identity of a patient.
 *
 * Patient is intentionally separate from Customer.
 * Customer represents the commercial relationship,
 * while Patient represents the person receiving care.
 */

export type PatientStatus =
  | "active"
  | "inactive"
  | "archived"
  | "deceased";

export type PatientGender =
  | "male"
  | "female"
  | "non_binary"
  | "unknown"
  | "other";

export interface PatientName {

  firstName: string;

  middleName?: string;

  lastName: string;

  preferredName?: string;

}

export interface PatientDateOfBirth {

  date: string;

}

export interface PatientContact {

  email?: string;

  phone?: string;

}

export interface PatientAddress {

  line1?: string;

  line2?: string;

  city?: string;

  state?: string;

  postalCode?: string;

  countryCode?: string;

}

export interface PatientEmergencyContact {

  name: string;

  relationship?: string;

  phone: string;

}

export interface PatientIdentifiers {

  medicalRecordNumber: string;

  externalId?: string;

}

export interface PatientMetadata {

  notes?: string;

  archived: boolean;

}

export interface Patient {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  customerId?: string;

  status: PatientStatus;

  name: PatientName;

  gender: PatientGender;

  dateOfBirth: PatientDateOfBirth;

  contact: PatientContact;

  address: PatientAddress;

  emergencyContact?: PatientEmergencyContact;

  identifiers: PatientIdentifiers;

  metadata: PatientMetadata;

  createdAt: string;

  updatedAt: string;

}