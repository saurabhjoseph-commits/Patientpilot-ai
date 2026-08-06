import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import { getCurrentUser } from "@/lib/auth-server";
import { Permissions } from "@/lib/platform/domain/identity";

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

  return (
    <AdminShell canViewClinics={user.permissionCodes.includes(Permissions.ClinicRead)} canViewDoctors={user.permissionCodes.includes(Permissions.DoctorsRead)} canManageGlobal={user.permissionCodes.includes(Permissions.DoctorsManageGlobal)}>
      {children}
    </AdminShell>
  );
}
