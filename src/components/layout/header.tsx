"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTenant } from "@/lib/tenant-context";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  ChevronDown,
  X,
  MessageSquare,
  Users,
  GraduationCap,
  FileText,
  Send,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { SearchResult } from "@/types";

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const { tenant, currentUser, logout } = useTenant();
  const pathname = usePathname();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search debouncing
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&tenantId=${tenant.id}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, tenant.id]);

  const handleSelectResult = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(url);
  };

  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Overview Dashboard";
    if (pathname.includes("/inbox")) return "WhatsApp Inbox";
    if (pathname.includes("/leads")) return "Leads & Prospects";
    if (pathname.includes("/messaging/templates")) return "Message Templates";
    if (pathname.includes("/messaging/campaigns")) return "Marketing Campaigns";
    if (pathname.includes("/messaging/history")) return "Campaign & Message Audit";
    if (pathname.includes("/messaging")) return "Messaging";
    if (pathname.includes("/courses") || pathname.includes("/offers")) return "Course Catalog";
    if (pathname.includes("/knowledge-base")) return "Admissions Knowledge Base";
    if (pathname.includes("/whatsapp")) return "WhatsApp Connection";
    if (pathname.includes("/analytics")) return "Admissions Analytics";
    if (pathname.includes("/team")) return "Team & Permissions";
    if (pathname.includes("/settings")) return "Admissions Platform Settings";
    return "Overview";
  };

  const notifications = [
    {
      id: "n-1",
      title: "Counseling Request: Rahul Sharma",
      desc: "High-intent inquiry for Performance Marketing Specialist with EMI questions.",
      time: "2m ago",
      unread: true,
      url: "/inbox",
    },
    {
      id: "n-2",
      title: "New Qualified Lead Captured",
      desc: "Priya Das engaged with WhatsApp bot and completed enrollment questionnaire.",
      time: "12m ago",
      unread: true,
      url: "/leads",
    },
    {
      id: "n-3",
      title: "Marketing Campaign Delivered",
      desc: "August Admissions Drive completed with 97.2% delivery rate to 142 prospects.",
      time: "1h ago",
      unread: true,
      url: "/messaging/history",
    },
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        {/* Left: Mobile Toggle + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {getPageTitle()}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              Here&apos;s what&apos;s happening with your admissions today.
            </p>
          </div>
        </div>

        {/* Right: Search, Notifications & User */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-64 lg:w-72 px-3 py-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-100/70 transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              <span className="truncate">Search leads, conversations, courses...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                      {unreadCount} new
                    </span>
                  </div>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] text-blue-900 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        router.push(n.url);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser?.avatar || "AA"}
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <span className="font-bold text-slate-900 block truncate max-w-[120px]">
                {currentUser?.name || "Aakasa Admin"}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">
                {currentUser?.role ? currentUser.role.replace("_", " ") : "Tenant Admin"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads, conversations, courses, templates, campaigns..."
                className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded">
                ESC
              </kbd>
            </div>

            {/* Results Body */}
            <div className="max-h-96 overflow-y-auto p-2">
              {isSearching ? (
                <div className="p-8 text-center text-xs text-slate-400">Searching admissions records...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result) => {
                    const Icon =
                      result.type === "lead"
                        ? Users
                        : result.type === "conversation"
                        ? MessageSquare
                        : result.type === "course"
                        ? GraduationCap
                        : result.type === "template"
                        ? FileText
                        : Send;

                    return (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSelectResult(result.url)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-900">
                              {result.title}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{result.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider capitalize bg-slate-100 px-2 py-0.5 rounded">
                          {result.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No admissions records found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-600">Quick Searches</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setSearchQuery("Marketing")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px]"
                    >
                      Marketing
                    </button>
                    <button
                      onClick={() => setSearchQuery("High Intent")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px]"
                    >
                      High Intent
                    </button>
                    <button
                      onClick={() => setSearchQuery("SEO")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px]"
                    >
                      SEO & GEO
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
