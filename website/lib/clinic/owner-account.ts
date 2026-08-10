export interface ClinicOwnerAccount {
  fullName: string;
  email: string;
  role: "owner" | "manager";
  sendInvitation: boolean;
}

export const DEFAULT_CLINIC_OWNER_ACCOUNT: ClinicOwnerAccount = {
  fullName: "",
  email: "",
  role: "owner",
  sendInvitation: true,
};

export function validateClinicOwnerAccount(value: ClinicOwnerAccount): string | null {
  if (!value.fullName.trim()) return "Owner name is required.";
  if (!/^\S+@\S+\.\S+$/.test(value.email.trim())) return "A valid owner email is required.";
  if (value.role !== "owner" && value.role !== "manager") return "Owner role must be owner or manager.";
  return null;
}
