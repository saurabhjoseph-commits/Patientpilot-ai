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
    name: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
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
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-950 text-white">
      {/* Logo */}

      <div className="border-b border-slate-800 px-6 py-7">
        <h1 className="text-3xl font-bold">
          PatientPilot AI
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Admin Dashboard
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
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
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white"
        >
          <LogOut className="h-5 w-5" />

          Logout
        </Link>
      </div>
    </aside>
  );
}