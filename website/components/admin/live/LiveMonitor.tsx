"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  RefreshCw,
} from "lucide-react";

import ActiveCallCard from "./ActiveCallCard";
import TranscriptPanel from "./TranscriptPanel";

import type {
  LiveCall,
  LiveMonitorResponse,
} from "@/types/live-monitor";

export default function LiveMonitor() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [calls, setCalls] = useState<LiveCall[]>([]);
  const [selectedCallSid, setSelectedCallSid] = useState<string>();

  const [summary, setSummary] =
    useState<LiveMonitorResponse["summary"]>({
      activeCalls: 0,
      completedCalls: 0,
      failedCalls: 0,
      totalCalls: 0,
    });

  async function loadCalls(showSpinner = false) {
    try {
      if (showSpinner) {
        setRefreshing(true);
      }

      const response = await fetch("/api/live/calls", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load live calls.");
      }

      const data: LiveMonitorResponse =
        await response.json();

      setCalls(data.calls);
      setSummary(data.summary);

      if (
        data.calls.length > 0 &&
        !selectedCallSid
      ) {
        setSelectedCallSid(
          data.calls[0].callSid
        );
      }

      if (
        selectedCallSid &&
        !data.calls.find(
          (c) => c.callSid === selectedCallSid
        )
      ) {
        setSelectedCallSid(
          data.calls[0]?.callSid
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCalls();

    const interval = setInterval(() => {
      loadCalls();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const selectedCall = useMemo(
    () =>
      calls.find(
        (call) =>
          call.callSid === selectedCallSid
      ),
    [calls, selectedCallSid]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Live Conversation Monitor
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor active AI receptionist
            conversations in real time.
          </p>
        </div>

        <button
          onClick={() => loadCalls(true)}
          className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          title="Active Calls"
          value={summary.activeCalls}
          icon={<PhoneCall className="h-5 w-5" />}
        />

        <SummaryCard
          title="Completed"
          value={summary.completedCalls}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
        />

        <SummaryCard
          title="Failed"
          value={summary.failedCalls}
          icon={
            <AlertCircle className="h-5 w-5" />
          }
        />

        <SummaryCard
          title="Total"
          value={summary.totalCalls}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left */}
        <div className="space-y-4 xl:col-span-1">
          {loading ? (
            <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
              Loading...
            </div>
          ) : calls.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center">
              <PhoneCall className="mx-auto mb-4 h-10 w-10 text-slate-300" />

              <h3 className="font-semibold">
                No Active Calls
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Waiting for incoming
                conversations...
              </p>
            </div>
          ) : (
            calls.map((call) => (
              <ActiveCallCard
                key={call.callSid}
                call={call}
                onClick={(selected) =>
                  setSelectedCallSid(
                    selected.callSid
                  )
                }
              />
            ))
          )}
        </div>

        {/* Right */}
        <div className="xl:col-span-2">
          {selectedCall ? (
            <TranscriptPanel
              transcript={
                selectedCall.transcript
              }
            />
          ) : (
            <div className="flex h-[650px] items-center justify-center rounded-xl border bg-white">
              <div className="text-center">
                <PhoneCall className="mx-auto mb-4 h-10 w-10 text-slate-300" />

                <h3 className="text-lg font-semibold">
                  Select a Call
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Choose an active call to
                  monitor.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function SummaryCard({
  title,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}