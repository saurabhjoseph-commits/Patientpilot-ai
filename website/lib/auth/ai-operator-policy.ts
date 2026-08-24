import type { CatalogPermission } from "@/lib/platform/domain/identity";
import { DefaultRolePolicies, Permissions } from "@/lib/platform/domain/identity";

export const AI_OPERATOR_PROFILE_ROLE = "ai_operator";
export const AI_OPERATOR_ROLE_CODE = "ai-operator";
export const E2E_SOURCE = "agent12-e2e";
export const E2E_NAME_PREFIX = "[E2E] ";

type Environment = Readonly<Record<string, string | undefined>>;

const stagingWritePermissions: readonly CatalogPermission[] = [
  Permissions.ClinicTestCreate,
  Permissions.ClinicSettingsTestUpdate,
  Permissions.LeadsTestCreate,
  Permissions.LeadsTestCleanup,
  Permissions.PatientsTestCreate,
  Permissions.PatientsTestCleanup,
  Permissions.AppointmentsTestCreate,
  Permissions.AppointmentsTestCleanup,
];

const productionHosts = new Set(["patientpilot-ai.com", "www.patientpilot-ai.com"]);

export function isStagingEnvironment(environment: Environment): boolean {
  return environment.VERCEL_ENV === "preview" || environment.APP_ENV === "staging" || environment.E2E_TARGET === "staging";
}

export function isStagingGlobalOperatorEnabled(environment: Environment): boolean {
  return environment.AI_OPERATOR_STAGING_GLOBAL_ENABLED === "true" && isStagingEnvironment(environment) && environment.VERCEL_ENV !== "production";
}

export function permissionsForRole(roleCode: string, environment: Environment): readonly CatalogPermission[] {
  const base = DefaultRolePolicies[roleCode] ?? [];
  if (roleCode !== AI_OPERATOR_ROLE_CODE || !isStagingGlobalOperatorEnabled(environment)) return base;
  return [...base, Permissions.StagingGlobalTestRead, ...stagingWritePermissions];
}

export function isSyntheticTestRecord(record: Readonly<Record<string, unknown>>): boolean {
  return record.is_test === true && (record.source === E2E_SOURCE || (typeof record.name === "string" && record.name.startsWith(E2E_NAME_PREFIX)));
}

export function assertSyntheticTestMutation(record: Readonly<Record<string, unknown>>): void {
  if (!isSyntheticTestRecord(record)) throw new Error("AI Operator may mutate only explicitly tagged synthetic E2E data.");
}

export function assertE2EExecutionSafety(input: { target: "staging" | "production"; baseUrl: string; writesRequested: boolean; allowStagingWrites: boolean }): void {
  const hostname = new URL(input.baseUrl).hostname.toLowerCase();
  if (input.writesRequested && productionHosts.has(hostname)) throw new Error("Destructive E2E flows are permanently disabled on PatientPilot production hosts.");
  if (input.target === "production" && input.writesRequested) throw new Error("Production E2E mode is read-only.");
  if (input.writesRequested && (input.target !== "staging" || !input.allowStagingWrites)) throw new Error("Staging writes require the explicit E2E_ALLOW_STAGING_WRITES=true guard.");
}
