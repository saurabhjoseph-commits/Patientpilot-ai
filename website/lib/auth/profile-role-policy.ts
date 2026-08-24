import { AI_OPERATOR_PROFILE_ROLE, AI_OPERATOR_ROLE_CODE, permissionsForRole } from "./ai-operator-policy";

const profileRoleCodes: Readonly<Record<string, string>> = {
  super_admin: "super-admin",
  owner: "clinic-owner",
  manager: "practice-manager",
  receptionist: "receptionist",
  dentist: "dentist",
  doctor: "dentist",
  [AI_OPERATOR_PROFILE_ROLE]: AI_OPERATOR_ROLE_CODE,
};

export function parseProfileRole(profileRole: string | null | undefined): string | null {
  return profileRole ? profileRoleCodes[profileRole] ?? null : null;
}

export function resolveProfileRolePolicy(profileRole: string | null | undefined, environment: Readonly<Record<string, string | undefined>> = process.env) {
  const roleCode = parseProfileRole(profileRole);
  return roleCode ? { roleCode, permissionCodes: permissionsForRole(roleCode, environment) } : null;
}
