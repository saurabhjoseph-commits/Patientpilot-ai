"use client";

import { Bell, Menu, Search, UserCircle } from "lucide-react";

type Presentation = { isPlatformAdmin: boolean; userName: string; clinicName: string | null; dashboardLabel: string };

export default function Topbar({ onMenuClick, presentation }: { onMenuClick?: () => void; presentation: Presentation }) {
  const clinicContext = presentation.isPlatformAdmin ? "PatientPilot AI" : presentation.clinicName;
  return <header className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6"><div className="flex min-w-0 items-center gap-3"><button aria-label="Open navigation" onClick={onMenuClick} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"><Menu size={24} /></button><div className="min-w-0"><h2 className="truncate text-lg font-bold text-slate-800 sm:text-2xl">{presentation.dashboardLabel}</h2><p className="truncate text-sm text-slate-500">Welcome back, {presentation.userName} 👋</p><p className="truncate text-xs text-slate-400">{clinicContext}</p></div></div><div className="flex shrink-0 items-center gap-2 sm:gap-4"><div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search..." className="rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="relative rounded-lg p-2 hover:bg-slate-100"><Bell size={22} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-2"><UserCircle size={34} className="text-slate-600" /><div className="hidden sm:block"><p className="text-sm font-semibold text-slate-800">{presentation.userName}</p><p className="text-xs text-slate-500">{clinicContext}</p></div></div></div></header>;
}
