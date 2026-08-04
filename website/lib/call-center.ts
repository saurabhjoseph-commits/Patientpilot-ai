import { supabaseServer } from "@/lib/supabase-server";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";

/**
 * Get all active calls
 */
export async function getActiveCalls(scope: ClinicScope) {
  const { data, error } = await supabaseServer
    .from("calls")
    .select("*")
    .eq("clinic_id", scope.clinicId)
    .in("status", ["ringing", "connected", "in_progress"])
    .order("started_at", { ascending: false });

  if (error) {
    console.error("getActiveCalls:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Get recent calls
 */
export async function getRecentCalls(scope: ClinicScope, limit: number = 25) {
  const { data, error } = await supabaseServer
    .from("calls")
    .select("*")
    .eq("clinic_id", scope.clinicId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentCalls:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Get transcript for a call
 */
export async function getCallTranscript(scope: ClinicScope, callId: string) {
  const { data: call, error: callError } = await supabaseServer
    .from("calls")
    .select("id")
    .eq("id", callId)
    .eq("clinic_id", scope.clinicId)
    .maybeSingle();
  if (callError || !call) return [];
  const { data, error } = await supabaseServer
    .from("call_messages")
    .select("*")
    .eq("call_id", callId)
    .eq("clinic_id", scope.clinicId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCallTranscript:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Get upcoming appointments
 */
export async function getUpcomingAppointments(scope: ClinicScope, limit: number = 10) {
  const { data, error } = await supabaseServer
    .from("appointments")
    .select("*")
    .eq("clinic_id", scope.clinicId)
    .order("appointment_date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getUpcomingAppointments:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Dashboard Metrics
 */
export async function getDashboardMetrics(scope: ClinicScope) {
  const [
    activeCalls,
    recentCalls,
    appointments,
  ] = await Promise.all([
    getActiveCalls(scope),
    getRecentCalls(scope, 10),
    getUpcomingAppointments(scope, 10),
  ]);

  return {
    activeCallsCount: activeCalls.length,
    recentCallsCount: recentCalls.length,
    upcomingAppointmentsCount: appointments.length,
    activeCalls,
    recentCalls,
    appointments,
  };
}
