export interface ClinicContact {
  primaryContactName: string;

  primaryContactTitle: string;

  primaryEmail: string;

  primaryPhone: string;

  emergencyPhone?: string;
}

export const DEFAULT_CLINIC_CONTACT: ClinicContact = {
  primaryContactName: "",
  primaryContactTitle: "",
  primaryEmail: "",
  primaryPhone: "",
  emergencyPhone: "",
};

export function isClinicContactComplete(
  contact: ClinicContact,
): boolean {
  return (
    contact.primaryContactName.trim().length > 0 &&
    contact.primaryEmail.trim().length > 0 &&
    contact.primaryPhone.trim().length > 0
  );
}