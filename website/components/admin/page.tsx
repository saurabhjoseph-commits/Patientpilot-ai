import StatsCard from "@/components/admin/StatsCard";
import DashboardClient from "@/components/admin/DashboardClient";
import { supabaseServer } from "@/lib/supabase-server";

import {
  Users,
  CalendarDays,
  PhoneCall,
  DollarSign,
} from "lucide-react";

export default async function AdminPage() {
  // Contacts
  const { data: contacts } = await supabaseServer
    .from("contacts")
    .select("*");

  // Appointments
  const { data: appointments } = await supabaseServer
    .from("appointments")
    .select("*");

  const totalLeads = contacts?.length ?? 0;
  const totalAppointments = appointments?.length ?? 0;

  // Today's AI Calls
  const today = new Date().toDateString();

  const todayCalls =
    appointments?.filter(
      (appointment) =>
        new Date(
          appointment.created_at
        ).toDateString() === today
    ).length ?? 0;

  // Estimated Revenue
  const revenue = totalAppointments * 150;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold">
          PatientPilot AI Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your AI Receptionist and clinic leads.
        </p>
      </div>

      <div className="grid gap-6