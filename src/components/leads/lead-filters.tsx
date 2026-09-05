"use client";

import React from "react";
import { LeadStatus } from "@/types";
import { Search, RotateCcw, Filter, Calendar } from "lucide-react";

interface LeadFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (val: string) => void;
  courseFilter: string;
  onCourseFilterChange: (val: string) => void;
  dateFilter: string;
  onDateFilterChange: (val: string) => void;
  handoffFilter: string;
  onHandoffFilterChange: (val: string) => void;
  coursesList?: string[];
  onReset: () => void;
}

export function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
  courseFilter,
  onCourseFilterChange,
  dateFilter,
  onDateFilterChange,
  handoffFilter,
  onHandoffFilterChange,
  coursesList = [],
  onReset,
}: LeadFiltersProps) {
  const statuses: (LeadStatus | "All")[] = [
    "All",
    "New",
    "Engaged",
    "Qualified",
    "Follow-up",
    "Converted",
    "Lost",
  ];

  const sources = [
    "All Sources",
    "WhatsApp Organic",
    "WhatsApp Click-to-Chat Ads",
    "Google Ads",
    "Instagram",
    "Website",
    "Other",
  ];

  const datePresets = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_7_days", label: "Last 7 days" },
    { value: "last_30_days", label: "Last 30 days" },
    { value: "this_month", label: "This month" },
  ];

  const hasActiveFilters =
    search ||
    statusFilter !== "All" ||
    sourceFilter !== "All Sources" ||
    courseFilter !== "All Courses" ||
    dateFilter !== "all" ||
    handoffFilter !== "all";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name, phone, city, goal, questions..."
            className="w-full pl-8.5 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 focus:bg-white transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Preset */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              {datePresets.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All Statuses" : st}
                </option>
              ))}
            </select>
          </div>

          {/* Course Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={courseFilter}
              onChange={(e) => onCourseFilterChange(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-900 max-w-[150px] truncate cursor-pointer"
            >
              <option value="All Courses">All Courses</option>
              {coursesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={sourceFilter}
              onChange={(e) => onSourceFilterChange(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              {sources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Handoff Filter */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={handoffFilter}
              onChange={(e) => onHandoffFilterChange(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              <option value="all">All Handoffs</option>
              <option value="handoff_only">Handoff Active Only</option>
              <option value="ai_only">AI Handling Only</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
