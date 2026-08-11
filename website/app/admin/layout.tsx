import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import { getCurrentUser } from "@/lib/auth-server";
import { Permissions } from "@/lib/platform/domain/identity";
import { getAdminDashboardPresentation } from "@/lib/clinic/dashboard-presentation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  if ("requiresPasswordChange" in user && user.requiresPasswordChange) redirect("/set-password");
  let presentation;
  try { presentation = await getAdminDashboardPresentation(user); }
  catch {
    return <main className="min-h-screen bg-slate-100 p-8"><section role="alert" className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h1 className="text-xl font-semibold">Clinic configuration unavailable</h1><p className="mt-2 text-sm">Your authenticated clinic identity could not be verified. Contact a PatientPilot AI administrator.</p></section></main>;
  }

  return (
    <AdminShell canViewClinics={user.permissionCodes.includes(Permissions.ClinicRead)} canViewDoctors={user.permissionCodes.includes(Permissions.DoctorsRead)} canViewCalendar={user.permissionCodes.includes(Permissions.CalendarRead) || user.permissionCodes.includes(Permissions.CalendarReadOwn)} canManageGlobal={user.permissionCodes.includes(Permissions.DoctorsManageGlobal)} presentation={presentation}>
      {children}
    </AdminShell>
  );
}
