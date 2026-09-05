import React from "react";
import Link from "next/link";
import { MOCK_ORGANIZATIONS } from "@/data/mock-organizations";
import {
  Building2,
  Users,
  MessageSquare,
  Server,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function PlatformDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Superadmin Overview</h1>
        <p className="text-xs text-slate-400 mt-1">
          Global multi-tenant infrastructure metrics, tenant provisioning, and platform health.
        </p>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Tenants</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">{MOCK_ORGANIZATIONS.length}</p>
          <span className="text-[11px] text-emerald-400">100% Provisioned</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Platform Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">14</p>
          <span className="text-[11px] text-slate-400">Across all organizations</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">WhatsApp Volume (24h)</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">2,140</p>
          <span className="text-[11px] text-emerald-400">No rate limit breaches</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">System Uptime</span>
            <Server className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2 font-mono">99.98%</p>
          <span className="text-[11px] text-slate-400">Healthy cluster</span>
        </div>
      </div>

      {/* Organizations Table Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Provisioned Organizations</h2>
            <p className="text-xs text-slate-400">Multi-tenant instances deployed on platform</p>
          </div>
          <Link
            href="/platform/organizations"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {MOCK_ORGANIZATIONS.map((org) => (
            <div key={org.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-base">
                  {org.logo}
                </span>
                <div>
                  <p className="font-bold text-white">{org.name}</p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    ID: {org.id} • Slug: {org.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {org.businessType} ({org.offerType})
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Isolated
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
