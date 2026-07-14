import { DemoProfile } from "@/types/demo";

export async function getDemoProfiles(): Promise<
  DemoProfile[]
> {
  return [];
}

export async function getLatestDemoProfile(): Promise<DemoProfile | null> {
  return null;
}

export async function createDemoProfile(
  profile: Partial<DemoProfile>
) {
  console.log(profile);
}

export async function deleteDemoProfile(
  id: string
) {
  console.log(id);
}