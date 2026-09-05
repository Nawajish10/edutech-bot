"use client";

import React, { useState } from "react";
import { Lead, LeadStatus } from "@/types";
import { useTenant } from "@/lib/tenant-context";
import { LeadDetail } from "./lead-detail";
import {
  AlertCircle,
  Send,
  UserCheck,
  Download,
  X,
  MoreVertical,
  CheckSquare,
  Square,
  MessageSquare,
} from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onSendWhatsAppCampaign?: (leadIds: string[]) => void;
  onAssignAgent?: (leadIds: string[]) => void;
}

export function LeadTable({
  leads,
  onSendWhatsAppCampaign,
  onAssignAgent,
}: LeadTableProps) {
  const { getOfferLabel } = useTenant();
  const offerLabel = getOfferLabel(false);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const isAllSelected = leads.length > 0 && selectedLeadIds.length === leads.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l.id));
    }
  };

  const toggleSelectLead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Engaged":
        return "bg-blue-50 text-blue-900 border-blue-200";
      case "Qualified":
        return "bg-indigo-50 text-indigo-900 border-indigo-200";
      case "Follow-up":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Converted":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Lost":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const exportSelectedCSV = () => {
    const listToExport =
      selectedLeadIds.length > 0
        ? leads.filter((l) => selectedLeadIds.includes(l.id))
        : leads;

    const headers = [
      "ID",
      "Name",
      "Phone",
      "Course",
      "Status",
      "City",
      "Budget",
      "Handoff",
      "Source",
      "Assigned To",
      "Created At",
    ];
    const rows = listToExport.map((l) => [
      l.id,
      `"${l.name}"`,
      l.phone,
      `"${l.offerInterest}"`,
      l.status,
      l.city,
      `"${l.budget}"`,
      l.humanHandoff ? "Yes" : "No",
      `"${l.source}"`,
      `"${l.assignedTo}"`,
      l.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aakasa_leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative space-y-3">
      {/* Floating Bulk Action Bar when leads are selected */}
      {selectedLeadIds.length > 0 && (
        <div className="sticky top-20 z-20 bg-blue-900 text-white p-3 sm:px-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
              {selectedLeadIds.length}
            </span>
            <span className="text-xs font-semibold">
              {selectedLeadIds.length === 1 ? "1 lead selected" : `${selectedLeadIds.length} leads selected`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Send WhatsApp Template Broadcast */}
            <button
              onClick={() => onSendWhatsAppCampaign && onSendWhatsAppCampaign(selectedLeadIds)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send WhatsApp Template</span>
            </button>

            {/* Assign Agent */}
            <button
              onClick={() => onAssignAgent && onAssignAgent(selectedLeadIds)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign</span>
            </button>

            {/* Export Selected */}
            <button
              onClick={exportSelectedCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Clear Selection */}
            <button
              onClick={() => setSelectedLeadIds([])}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main CRM Leads Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="p-0.5 text-slate-400 hover:text-blue-900 transition-colors"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-900" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Lead Contact</th>
                <th className="px-4 py-3">Course Interest</th>
                <th className="px-4 py-3">Goal &amp; Intent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Assigned Advisor</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-400 text-xs">
                    No leads found matching current filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3" onClick={(e) => toggleSelectLead(lead.id, e)}>
                        <button className="p-0.5 text-slate-400 hover:text-blue-900">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-900" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Lead Contact */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{lead.name}</span>
                          {lead.humanHandoff && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5 text-amber-700" />
                              Handoff
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{lead.phone}</div>
                        <div className="text-[10px] text-slate-400">{lead.city}</div>
                      </td>

                      {/* Course */}
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="truncate font-semibold text-blue-900" title={lead.offerInterest}>
                          {lead.offerInterest}
                        </p>
                        <span className="text-[10px] text-slate-400">Budget: {lead.budget}</span>
                      </td>

                      {/* Goal & Intent */}
                      <td className="px-4 py-3 max-w-xs">
                        <p className="truncate font-medium text-slate-800">{lead.goal}</p>
                        {lead.questions ? (
                          <span className="text-[10px] text-amber-700 truncate block">
                            Q: {lead.questions}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">{lead.experienceLevel}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3 text-slate-600">
                        <span className="text-xs font-medium">{lead.source}</span>
                      </td>

                      {/* Assigned Advisor */}
                      <td className="px-4 py-3 text-slate-600">
                        <span className="text-xs">{lead.assignedTo || "Unassigned"}</span>
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Recent"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold text-blue-900 hover:bg-blue-50 border border-blue-200 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
