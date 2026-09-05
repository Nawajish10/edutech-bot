"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTenant } from "@/lib/tenant-context";
import { MOCK_LEADS } from "@/data/mock-leads";
import { LeadTable } from "@/components/leads/lead-table";
import { LeadFilters } from "@/components/leads/lead-filters";
import { CampaignModal } from "@/components/messaging/campaign-modal";
import { Lead } from "@/types";
import { UserPlus, Download, Send, Plus, X, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LeadsContent() {
  const { tenant } = useTenant();
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState<Lead[]>(() => {
    const list = MOCK_LEADS.filter((l) => l.tenantId === tenant.id);
    return list.length > 0 ? list : MOCK_LEADS.filter((l) => l.tenantId === "tenant-aakasa");
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [dateFilter, setDateFilter] = useState("all");
  const [handoffFilter, setHandoffFilter] = useState("all");

  // Modals
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignSelectedLeadIds, setCampaignSelectedLeadIds] = useState<string[]>([]);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadCourse, setNewLeadCourse] = useState("Performance Marketing Specialist");
  const [newLeadCity, setNewLeadCity] = useState("Delhi NCR");
  const [newLeadGoal, setNewLeadGoal] = useState("Career Transition & Job Placement");
  const [newLeadBudget, setNewLeadBudget] = useState("Standard / Self-funded");

  // Check URL query parameters (e.g. ?search=... or ?action=new)
  useEffect(() => {
    const qSearch = searchParams.get("search");
    if (qSearch) setSearch(qSearch);

    const qAction = searchParams.get("action");
    if (qAction === "new") setIsAddLeadModalOpen(true);
  }, [searchParams]);

  const fetchLeads = () => {
    setIsLoading(true);
    fetch(`/api/leads?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
        }
      })
      .catch((err) => console.error("Error fetching leads:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [tenant.id]);

  // Extract unique courses for filter dropdown
  const coursesList = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.offerInterest) set.add(l.offerInterest);
    });
    return Array.from(set);
  }, [leads]);

  // Apply search and multi-filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(search) ||
        lead.city.toLowerCase().includes(q) ||
        lead.goal.toLowerCase().includes(q) ||
        lead.offerInterest.toLowerCase().includes(q) ||
        (lead.questions && lead.questions.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (statusFilter !== "All" && lead.status !== statusFilter) return false;
      if (sourceFilter !== "All Sources" && lead.source !== sourceFilter) return false;
      if (courseFilter !== "All Courses" && lead.offerInterest !== courseFilter) return false;

      if (handoffFilter === "handoff_only" && !lead.humanHandoff) return false;
      if (handoffFilter === "ai_only" && lead.humanHandoff) return false;

      return true;
    });
  }, [leads, search, statusFilter, sourceFilter, courseFilter, handoffFilter]);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("All");
    setSourceFilter("All Sources");
    setCourseFilter("All Courses");
    setDateFilter("all");
    setHandoffFilter("all");
  };

  const handleOpenBulkCampaign = (leadIds: string[]) => {
    setCampaignSelectedLeadIds(leadIds);
    setIsCampaignModalOpen(true);
  };

  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    setIsSavingLead(true);
    try {
      const payload: Partial<Lead> = {
        id: `lead-${Date.now()}`,
        tenantId: tenant.id,
        contactId: `contact-${Date.now()}`,
        name: newLeadName.trim(),
        phone: newLeadPhone.trim(),
        goal: newLeadGoal,
        experienceLevel: "Beginner",
        offerInterest: newLeadCourse,
        currentStatus: "Prospecting",
        budget: newLeadBudget,
        preferredStartDate: "Next Cohort",
        city: newLeadCity,
        humanHandoff: false,
        status: "New",
        assignedTo: "Kavita Nair (Advisor)",
        source: "Manual Entry",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsAddLeadModalOpen(false);
        setNewLeadName("");
        setNewLeadPhone("");
        fetchLeads();
      }
    } catch (err) {
      console.error("Failed to save lead:", err);
    } finally {
      setIsSavingLead(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Phone",
      "Goal",
      "Experience",
      "Course Interest",
      "Budget",
      "City",
      "Status",
      "Assigned To",
      "Source",
    ];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.phone,
      `"${l.goal}"`,
      l.experienceLevel,
      `"${l.offerInterest}"`,
      `"${l.budget}"`,
      l.city,
      l.status,
      l.assignedTo,
      l.source,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tenant.slug}_admissions_leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Admissions CRM &amp; Leads
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {filteredLeads.length} Prospects
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Capture, qualify, segment, and broadcast admissions messages to prospective students.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleOpenBulkCampaign(filteredLeads.map((l) => l.id))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Template</span>
          </button>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <LeadFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
        courseFilter={courseFilter}
        onCourseFilterChange={setCourseFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        handoffFilter={handoffFilter}
        onHandoffFilterChange={setHandoffFilter}
        coursesList={coursesList}
        onReset={handleReset}
      />

      {/* Leads Table with Checkboxes & Bulk Actions */}
      <LeadTable
        leads={filteredLeads}
        onSendWhatsAppCampaign={handleOpenBulkCampaign}
        onAssignAgent={(ids) => alert(`Assigned ${ids.length} leads to Kavita Nair (Advisor)`)}
      />

      {/* Guided 6-Step WhatsApp Campaign Modal */}
      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        initialLeadIds={campaignSelectedLeadIds}
        initialAudienceLabel={`${campaignSelectedLeadIds.length} leads selected from active CRM filters`}
        onSuccess={() => {
          fetchLeads();
        }}
      />

      {/* Add Manual Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Add Manual Prospect / Lead</h3>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Rohan Verma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="+91 98000 12345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Interest</label>
                  <select
                    value={newLeadCourse}
                    onChange={(e) => setNewLeadCourse(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="Performance Marketing Specialist">Performance Marketing Specialist</option>
                    <option value="Digital Marketing Career">Digital Marketing Career</option>
                    <option value="SEO & GEO Specialist">SEO &amp; GEO Specialist</option>
                    <option value="Digital Marketing Professional">Digital Marketing Professional</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Region</label>
                  <input
                    type="text"
                    value={newLeadCity}
                    onChange={(e) => setNewLeadCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Career Goal / Objective</label>
                <input
                  type="text"
                  value={newLeadGoal}
                  onChange={(e) => setNewLeadGoal(e.target.value)}
                  placeholder="e.g. Transition into Growth & Marketing"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLead}
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {isSavingLead ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Save Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
        </div>
      }
    >
      <LeadsContent />
    </React.Suspense>
  );
}

