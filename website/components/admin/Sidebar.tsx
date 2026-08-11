"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  PhoneCall,
  BarChart3,
  Bot,
  TerminalSquare,
  Settings,
  LogOut,
  Building2,
  Stethoscope,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    name: "Patients",
    href: "/admin/patients",
    icon: Users,
  },
  {
    name: "Clinics",
    href: "/admin/clinics",
    icon: Building2,
    requiresClinicRead: true,
    requiresGlobalManagement: true,
  },
  {
    name: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
  },
  {
    name: "Calendar",
    href: "/admin/calendar",
    icon: CalendarDays,
    requiresCalendarRead: true,
  },
  {
    name: "Doctors",
    href: "/admin/doctors",
    icon: Stethoscope,
    requiresDoctorsRead: true,
  },
  {
    name: "Call Center",
    href: "/admin/call-center",
    icon: PhoneCall,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "AI Assistant",
    href: "/admin/ai",
    icon: Bot,
  },
  {
    name: "Developer Console",
    href: "/admin/test-console",
    icon: TerminalSquare,
    requiresGlobalManagement: true,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  canViewClinics,
  canViewDoctors,
  canViewCalendar,
  canManageGlobal,
  presentation,
  onNavigate,
}: {
  canViewClinics: boolean;
  canViewDoctors: boolean;
  canViewCalendar: boolean;
  canManageGlobal: boolean;
  presentation: { isPlatformAdmin: boolean; clinicName: string | null; dashboardLabel: string };
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full min-h-screen w-full flex-col bg-slate-950 text-white">
      {/* Logo */}

      <div className="border-b border-slate-800 px-6 py-7">
        <h1 className="text-2xl font-bold">
          {presentation.isPlatformAdmin ? "PatientPilot AI" : presentation.clinicName}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {presentation.dashboardLabel}
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-2">
          {navigation.filter((item) =>
            (!item.requiresClinicRead || canViewClinics) &&
            (!item.requiresDoctorsRead || canViewDoctors) &&
            (!item.requiresCalendarRead || canViewCalendar) &&
            (!item.requiresGlobalManagement || canManageGlobal),
          ).map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}

      <div className="border-t border-slate-800 p-4">
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white"
        >
          <LogOut className="h-5 w-5" />

          Logout
        </Link>
      </div>
    </aside>
  );
}
