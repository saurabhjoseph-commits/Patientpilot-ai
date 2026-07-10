import { supabaseServer } from "@/lib/supabase-server";

/**
 * Get all active calls
 */
export async function getActiveCalls() {
  const { data, error } = await supabaseServer
    .from("calls")
    .select("*")
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
export async function getRecentCalls(limit: number = 25) {
  const { data, error } = await supabaseServer
    .from("calls")
    .select("*")
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
export async function getCallTranscript(callId: string) {
  const { data, error } = await supabaseServer
    .from("call_messages")
    .select("*")
    .eq("call_id", callId)
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
export async function getUpcomingAppointments(limit: number = 10) {
  const { data, error } = await supabaseServer
    .from("appointments")
    .select("*")
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
export async function getDashboardMetrics() {
  const [
    activeCalls,
    recentCalls,
    appointments,
  ] = await Promise.all([
    getActiveCalls(),
    getRecentCalls(10),
    getUpcomingAppointments(10),
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