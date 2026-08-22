import { supabaseServer } from "@/lib/supabase-server";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";

interface ActivityInput {
  leadId: number;
  type: string;
  description: string;
}

export async function logLeadActivity({
  leadId,
  type,
  description,
}: ActivityInput, scope: ClinicScope) {
  const { data: lead, error: leadError } = await supabaseServer
    .from("contacts")
    .select("id")
    .eq("id", leadId)
    .eq("clinic_id", scope.clinicId)
    .maybeSingle();

  if (leadError) throw leadError;
  if (!lead) throw new Error("Lead does not belong to the current clinic.");

  const { error } = await supabaseServer
    .from("lead_activity")
    .insert({
      lead_id: leadId,
      type,
      description,
    });

  if (error) {
    console.error(
      "Failed to log activity:",
      error.message
    );
  }
}
