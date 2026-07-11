import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";

import { supabaseServer } from "@/lib/supabase-server";
import { normalizeLead } from "@/lib/crm";

import StatusDropdown from "@/components/admin/StatusDropdown";
import LeadSummary from "@/components/admin/LeadSummary";
import LeadNotes from "@/components/admin/LeadNotes";
import QuickActions from "@/components/admin/LeadQuickActions";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import DeleteLeadButton from "@/components/admin/DeleteLeadButton";
import CallHistory from "@/components/admin/CallHistory";

import { LeadActivity } from "@/types/crm";

interface LeadPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailsPage({
  params,
}: LeadPageProps) {
  const { id } = await params;

  // Fetch Lead
  const { data, error } =
    await supabaseServer
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

  if (error || !data) {
    notFound();
  }

  const lead = normalizeLead(data);

  // Fetch Activity Timeline
  let activities: LeadActivity[] = [];

  const {
    data: activityData,
    error: activityError,
  } = await supabaseServer
    .from("lead_activity")
    .select("*")
    .eq("lead_id", lead.id)
    .order("created_at", {
      ascending: false,
    });

  if (activityError) {
    console.warn(
      "Lead Activity:",
      activityError.message
    );
  } else {
    activities =
      (activityData as LeadActivity[]) ??
      [];
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/leads"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Leads
          </Link>

          <h1 className="text-4xl font-bold">
            {lead.clinic_name}
          </h1>

          <p className="mt-2 text-gray-500">
            Lead ID #{lead.id}
          </p>
        </div>

        <StatusDropdown
          lead={lead}
        />
      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <Building2
            className="mb-3 text-blue-600"
            size={28}
          />

          <p className="text-sm text-gray-500">
            Clinic
          </p>

          <p className="font-semibold">
            {lead.clinic_name}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <User
            className="mb-3 text-green-600"
            size={28}
          />

          <p className="text-sm text-gray-500">
            Dentist
          </p>

          <p className="font-semibold">
            {lead.dentist_name}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <Phone
            className="mb-3 text-orange-600"
            size={28}
          />

          <p className="text-sm text-gray-500">
            Monthly Calls
          </p>

          <p className="text-2xl font-bold">
            {lead.monthly_calls}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <Calendar
            className="mb-3 text-purple-600"
            size={28}
          />

          <p className="text-sm text-gray-500">
            Created
          </p>

          <p className="font-semibold">
            {new Date(
              lead.created_at
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
            {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Contact Information */}
          <div className="rounded-xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail
                  className="text-blue-600"
                  size={22}
                />

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium">
                    {lead.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone
                  className="text-green-600"
                  size={22}
                />

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium">
                    {lead.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Message */}
          <div className="rounded-xl bg-white p-8 shadow">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <MessageSquare size={24} />
              Lead Message
            </h2>

            <div className="rounded-lg border bg-slate-50 p-6">
              {lead.message ? (
                <p className="leading-7">
                  {lead.message}
                </p>
              ) : (
                <p className="italic text-gray-500">
                  No message provided.
                </p>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <LeadNotes lead={lead} />

          {/* Activity Timeline */}
          <ActivityTimeline
            activities={activities}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <QuickActions lead={lead} />

          {/* Lead Summary */}
          <LeadSummary lead={lead} />

          {/* Call History */}
          <CallHistory />

          {/* Delete Lead */}
          <DeleteLeadButton lead={lead} />
        </div>
      </div>
    </div>
  );
}