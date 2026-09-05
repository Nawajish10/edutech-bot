"use client";

import React from "react";
import { useTenant } from "@/lib/tenant-context";
import { MOCK_DASHBOARD_DATA } from "@/data/mock-dashboard";
import { Funnel } from "@/components/dashboard/funnel";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { SourceBreakdown } from "@/components/dashboard/source-breakdown";
import { Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const { tenant } = useTenant();
  const dashboardData =
    MOCK_DASHBOARD_DATA[tenant.id] || MOCK_DASHBOARD_DATA["tenant-aakasa"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Analytics & Conversion Intelligence</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic funnel metrics, AI assistant SLAs, and channel attribution for {tenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last 30 Days (Simulated)</span>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Inbound Volume</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">850</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+18.4% vs last period</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Avg AI Response Speed</span>
          <p className="text-2xl font-bold text-blue-900 mt-1 font-mono">1.4s</p>
          <span className="text-[11px] text-emerald-700 font-semibold">99.8% within 2s SLA</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Human Handoff Rate</span>
          <p className="text-2xl font-bold text-amber-700 mt-1 font-mono">9.9%</p>
          <span className="text-[11px] text-slate-500 font-semibold">Healthy automation index</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">End-to-End Conversion</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">10.3%</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+1.2% this month</span>
        </div>
      </div>

      {/* Funnel & Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={dashboardData.activityChart} />
        </div>
        <div>
          <Funnel data={dashboardData.funnel} />
        </div>
      </div>

      {/* Acquisition Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceBreakdown data={dashboardData.sourceBreakdown} />

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">AI Assistant SLA & Performance</h3>
          <p className="text-xs text-slate-500 mb-4">Qualification accuracy and agent efficiency rates</p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Information Accuracy Score</span>
                <span className="text-blue-900">98.2%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-900 rounded-full" style={{ width: "98.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Intent Recognition Precision</span>
                <span className="text-emerald-700">94.7%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "94.7%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Direct Lead Form Completion</span>
                <span className="text-indigo-900">76.4%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "76.4%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
