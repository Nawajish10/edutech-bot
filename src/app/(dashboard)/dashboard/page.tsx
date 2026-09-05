"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTenant } from "@/lib/tenant-context";
import { DashboardData, MOCK_DASHBOARD_DATA } from "@/data/mock-dashboard";
import { Funnel } from "@/components/dashboard/funnel";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { NeedsAttention } from "@/components/dashboard/needs-attention";
import { SourceBreakdown } from "@/components/dashboard/source-breakdown";
import { OfferInterest } from "@/components/dashboard/offer-interest";
import { AIPerformance } from "@/components/dashboard/ai-performance";
import {
  Users,
  UserCheck,
  AlertTriangle,
  MessageSquare,
  GraduationCap,
  Calendar,
  ChevronDown,
  Plus,
  Send,
  BookPlus,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { tenant } = useTenant();
  const router = useRouter();

  const [dateRange, setDateRange] = useState("last_7_days");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);
  const qaRef = useRef<HTMLDivElement>(null);

  const fallbackData =
    MOCK_DASHBOARD_DATA[tenant.id] || MOCK_DASHBOARD_DATA["tenant-aakasa"];
  const [dashboardData, setDashboardData] = useState<DashboardData>(fallbackData);
  const [isLoading, setIsLoading] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
      if (qaRef.current && !qaRef.current.contains(e.target as Node)) {
        setIsQuickActionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch live dashboard metrics scoped to tenant and dateRange
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/dashboard?tenantId=${tenant.id}&dateRange=${dateRange}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.dashboard) {
          setDashboardData(data.dashboard);
        }
      })
      .catch((err) => console.error("Error fetching live dashboard:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tenant.id, dateRange]);

  const dateLabels: Record<string, string> = {
    today: "Today",
    yesterday: "Yesterday",
    last_7_days: "Last 7 days",
    last_30_days: "Last 30 days",
    this_month: "This month",
    custom: "Custom range",
  };

  const metrics = dashboardData.metrics;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Action Bar: Date Range Filter & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here&apos;s what&apos;s happening with your admissions today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Preset Filter */}
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs group"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              <span>{dateLabels[dateRange] || "Last 7 days"}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isDateOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-40 py-1 text-xs">
                {Object.entries(dateLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setDateRange(key);
                      setIsDateOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 transition-colors ${
                      dateRange === key
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Dropdown Button */}
          <div className="relative" ref={qaRef}>
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              <span>Quick Actions</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isQuickActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-40 py-1.5 text-xs">
                <Link
                  href="/leads"
                  onClick={() => setIsQuickActionsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Add Lead</span>
                </Link>
                <Link
                  href="/messaging/campaigns"
                  onClick={() => setIsQuickActionsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Send Campaign</span>
                </Link>
                <Link
                  href="/courses"
                  onClick={() => setIsQuickActionsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <BookPlus className="w-3.5 h-3.5 text-purple-600" />
                  <span>Add Course</span>
                </Link>
                <Link
                  href="/whatsapp"
                  onClick={() => setIsQuickActionsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-t border-slate-100"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Status</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 Primary KPI Cards matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. New Leads */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">New Leads</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {metrics.newLeads || 128}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <span>↑ {metrics.newLeadsChange || "18.4% vs previous 7 days"}</span>
          </p>
        </div>

        {/* 2. Qualified Leads */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Qualified Leads</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {metrics.qualifiedLeads || 74}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            {metrics.qualifiedLeadsChange || "57.8% of total leads"}
          </p>
        </div>

        {/* 3. Needs Attention */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Needs Attention</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {metrics.needsAttentionCount || 12}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-3">
            {metrics.highIntentNeedsAttentionCount || 8} high intent
          </p>
        </div>

        {/* 4. Conversations */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Conversations</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {metrics.newConversations || 246}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">
            {metrics.newConversationsChange || "184 AI handled, 62 human assisted"}
          </p>
        </div>

        {/* 5. Admissions Influenced */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Admissions Influenced</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {metrics.admissionsInfluenced || 18}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <span>↑ {metrics.admissionsInfluencedChange || "12.5% vs previous 7 days"}</span>
          </p>
        </div>
      </div>

      {/* Middle Row (3-column layout matching mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Admissions Funnel */}
        <div>
          <Funnel
            data={dashboardData.funnel}
            conversionRate={metrics.funnelConversionRate || "7.3%"}
          />
        </div>

        {/* Col 2: Conversations Trend */}
        <div>
          <ActivityChart data={dashboardData.conversationTrends} />
        </div>

        {/* Col 3: Needs Your Attention */}
        <div>
          <NeedsAttention items={dashboardData.needsAttention} />
        </div>
      </div>

      {/* Bottom Row (3-column layout matching mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Lead Sources Donut Chart */}
        <div>
          <SourceBreakdown data={dashboardData.sourceBreakdown} />
        </div>

        {/* Col 2: Top Courses by Interest */}
        <div>
          <OfferInterest data={dashboardData.topOfferInterests} />
        </div>

        {/* Col 3: AI Performance */}
        <div>
          <AIPerformance
            resolutionRate="75%"
            avgResponseTime="12 sec"
            handoffRate="25%"
            modelName="GPT-4o (via OpenRouter)"
            status="Operational"
          />
        </div>
      </div>
    </div>
  );
}
