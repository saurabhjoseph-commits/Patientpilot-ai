"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Lead {
  id: string;
  clinic_name: string;
  dentist_name: string;
  email: string;
  phone: string;
  monthly_calls: string;
  status: string;
  created_at: string;
}

interface DashboardClientProps {
  contacts: Lead[];
}

export default function DashboardClient({
  contacts,
}: DashboardClientProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredLeads = useMemo(() => {
    return contacts.filter((lead) => {
      const matchesSearch =
        lead.clinic_name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.dentist_name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, search, status]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search clinic, dentist, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3"
        >
          <option>All</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Demo Scheduled</option>
          <option>Demo Completed</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Showing <strong>{filteredLeads.length}</strong> lead(s)
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Clinic</th>
              <th className="p-4 text-left">Dentist</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-medium">{lead.clinic_name}</td>

                <td className="p-4">{lead.dentist_name}</td>

                <td className="p-4">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">
                    {lead.status}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>

                <td className="p-4 text-center">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="rounded-lg bg-cyan-600 px-3 py-2 text-white hover:bg-cyan-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-gray-500"
                >
                  No matching leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}