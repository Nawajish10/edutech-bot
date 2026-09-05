"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "@/lib/tenant-context";
import { TenantSwitcher } from "./tenant-switcher";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Send,
  FileText,
  Clock,
  GraduationCap,
  BookOpen,
  BarChart3,
  PhoneCall,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { tenant, isPlatformAdmin, currentUser, logout } = useTenant();
  const [isMessagingOpen, setIsMessagingOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Group 1: WORKSPACE
  const workspaceItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Inbox",
      href: "/inbox",
      icon: MessageSquare,
      badge: "4",
    },
    {
      label: "Leads",
      href: "/leads",
      icon: Users,
    },
  ];

  // Group 2: ENGAGEMENT
  const messagingSubItems = [
    {
      label: "Templates",
      href: "/messaging/templates",
      icon: FileText,
    },
    {
      label: "Campaigns",
      href: "/messaging/campaigns",
      icon: Send,
    },
    {
      label: "Message History",
      href: "/messaging/history",
      icon: Clock,
    },
  ];

  // Group 3: CATALOG
  const catalogItems = [
    {
      label: "Courses",
      href: "/courses",
      icon: GraduationCap,
    },
    {
      label: "Knowledge Base",
      href: "/knowledge-base",
      icon: BookOpen,
    },
  ];

  // Group 4: INSIGHTS
  const insightsItems = [
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
  ];

  // Group 5: ADMINISTRATION
  const adminItems = [
    {
      label: "WhatsApp",
      href: "/whatsapp",
      icon: PhoneCall,
      statusDot: true,
    },
    {
      label: "Team",
      href: "/team",
      icon: UserCheck,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isMessagingActive = pathname.startsWith("/messaging");

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200/80 flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm tracking-tighter">
            AA
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
              AAKASA AI
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Admissions Platform
            </p>
          </div>
        </div>
      </div>

      {/* Organization Switcher */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/40">
        <TenantSwitcher />
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* WORKSPACE */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            WORKSPACE
          </div>
          <div className="space-y-0.5">
            {workspaceItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  prefetch={true}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-blue-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-900"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ENGAGEMENT */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            ENGAGEMENT
          </div>
          <div className="space-y-0.5">
            {/* Collapsible Messaging */}
            <div>
              <button
                onClick={() => setIsMessagingOpen(!isMessagingOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isMessagingActive
                    ? "text-blue-900 font-semibold bg-blue-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className={`w-4 h-4 ${isMessagingActive ? "text-blue-900" : "text-slate-400"}`} />
                  <span>Messaging</span>
                </div>
                {isMessagingOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isMessagingOpen && (
                <div className="ml-4 pl-3 border-l border-slate-200 mt-1 space-y-0.5">
                  {messagingSubItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onNavigate}
                        prefetch={true}
                        className={`flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isSubActive
                            ? "bg-blue-900 text-white font-semibold"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CATALOG */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            CATALOG
          </div>
          <div className="space-y-0.5">
            {catalogItems.map((item) => {
              const isActive = pathname.startsWith(item.href) || (item.href === "/courses" && pathname.startsWith("/offers"));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  prefetch={true}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-blue-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* INSIGHTS */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            INSIGHTS
          </div>
          <div className="space-y-0.5">
            {insightsItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  prefetch={true}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-blue-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ADMINISTRATION */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            ADMINISTRATION
          </div>
          <div className="space-y-0.5">
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  prefetch={true}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-blue-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.statusDot && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Admin quick switch if platform_admin role */}
      {isPlatformAdmin && (
        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
          <Link
            href="/platform"
            onClick={onNavigate}
            prefetch={true}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="truncate text-[11px] font-semibold">Superadmin Console</span>
          </Link>
        </div>
      )}

      {/* User Area Footer */}
      <div className="p-3 border-t border-slate-100 relative bg-white">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0 text-left">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {currentUser?.avatar || "AA"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.name || "Aakasa Admin"}
              </p>
              <p className="text-[10px] text-slate-400 truncate capitalize">
                {currentUser?.role ? currentUser.role.replace("_", " ") : "Tenant Admin"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
        </button>

        {isUserMenuOpen && (
          <div className="absolute left-3 right-3 bottom-full mb-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
            <Link
              href="/settings"
              onClick={() => setIsUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Workspace Settings</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
