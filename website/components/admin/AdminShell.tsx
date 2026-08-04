"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <div className="hidden lg:block lg:shrink-0"><Sidebar /></div>
      {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>
      <div className="min-w-0 flex-1">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
