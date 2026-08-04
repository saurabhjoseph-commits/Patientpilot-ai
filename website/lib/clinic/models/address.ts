export interface ClinicAddress {
  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;

  timezone: string;
}

export const DEFAULT_CLINIC_ADDRESS: ClinicAddress = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  timezone: "America/New_York",
};

export function isClinicAddressComplete(
  address: ClinicAddress,
): boolean {
  return (
    address.addressLine1.trim().length > 0 &&
    address.city.trim().length > 0 &&
    address.state.trim().length > 0 &&
    address.postalCode.trim().length > 0 &&
    address.country.trim().length > 0 &&
    address.timezone.trim().length > 0
  );
}

export function formatClinicAddress(
  address: ClinicAddress,
): string {
  const line1 = address.addressLine1.trim();

  const line2 = address.addressLine2?.trim();

  const cityState = `${address.city}, ${address.state} ${address.postalCode}`;

  return [line1, line2, cityState, address.country]
    .filter(Boolean)
    .join("\n");
}