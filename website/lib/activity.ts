import { supabaseServer } from "@/lib/supabase-server";

interface ActivityInput {
  leadId: number;
  type: string;
  description: string;
}

export async function logLeadActivity({
  leadId,
  type,
  description,
}: ActivityInput) {
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