import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Building2,
  Users,
  Activity,
  Server,
  ArrowLeft,
} from "lucide-react";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Platform Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white uppercase tracking-wider">
                Platform Admin
              </h1>
              <p className="text-[10px] text-slate-400">Superadmin Console</p>
            </div>
          </div>
        </div>

        {/* Back to Tenant App Link */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/50">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Tenant App</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-medium">
          <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1.5 tracking-wider">
            Global Entities
          </div>

          <Link
            href="/platform"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Platform Dashboard</span>
          </Link>

          <Link
            href="/platform/organizations"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Organizations / Tenants</span>
          </Link>

          <Link
            href="/platform/users"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Platform Users</span>
          </Link>

          <Link
            href="/platform/usage"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Usage & Metering</span>
          </Link>

          <Link
            href="/platform/system"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <Server className="w-4 h-4 text-sky-400" />
            <span>System Health</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
          Environment: Production Multi-Tenant
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-900 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
