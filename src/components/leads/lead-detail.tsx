"use client";

import React, { useEffect } from "react";
import { Lead } from "@/types";
import { useTenant } from "@/lib/tenant-context";
import {
  X,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  DollarSign,
  HelpCircle,
  User,
  Share2,
  ShieldCheck,
  UserCheck,
  Briefcase,
  AlertCircle,
} from "lucide-react";

interface LeadDetailProps {
  lead?: Lead | null;
  onClose: () => void;
}

export function LeadDetail({ lead, onClose }: LeadDetailProps) {
  const { getOfferLabel } = useTenant();
  const offerLabel = getOfferLabel(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-50 flex flex-col overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{lead.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
                {lead.status}
              </span>
              {lead.humanHandoff && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                  Handoff Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{lead.phone}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 text-xs flex-1">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Lead</span>
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          {/* Core Qualification Details */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Lead Qualification Profile (Google Sheet Synced)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-900" />
                  Interested {offerLabel}
                </span>
                <p className="font-semibold text-slate-900">{lead.offerInterest}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <User className="w-3.5 h-3.5 text-blue-900" />
                  Experience Level
                </span>
                <p className="font-semibold text-slate-900">{lead.experienceLevel}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-900" />
                  Current Status / Background
                </span>
                <p className="font-semibold text-slate-900">{lead.currentStatus || "Not provided"}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-900" />
                  Budget Indication
                </span>
                <p className="font-semibold text-slate-900">{lead.budget || "Not specified"}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-900" />
                  Preferred Start Date
                </span>
                <p className="font-semibold text-slate-900">{lead.preferredStartDate}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-900" />
                  City / Location
                </span>
                <p className="font-semibold text-slate-900">{lead.city}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-900" />
                  Acquisition Source
                </span>
                <p className="font-semibold text-slate-900">{lead.source}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-900" />
                  Human Escalation
                </span>
                <p className="font-semibold text-slate-900">
                  {lead.humanHandoff ? "Yes (Handed to Advisor)" : "No (Autonomous AI)"}
                </p>
              </div>
            </div>
          </div>

          {/* Goal & Intent */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Goal & Objective
            </h4>
            <p className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed font-medium">
              {lead.goal}
            </p>
          </div>

          {/* Questions from Customer */}
          {lead.questions && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-600" />
                Customer Questions / Inquiries
              </h4>
              <p className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-amber-900 leading-relaxed font-medium">
                {lead.questions}
              </p>
            </div>
          )}

          {/* Internal Notes */}
          {lead.notes && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Staff / Counselor Notes
              </h4>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                {lead.notes}
              </p>
            </div>
          )}

          {/* Assignment & Audit Info */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center justify-between">
              <span>Assigned Advisor:</span>
              <span className="font-semibold text-slate-800">{lead.assignedTo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Lead Record ID:</span>
              <span className="font-mono text-slate-700">{lead.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Created At:</span>
              <span className="font-mono text-slate-700">{lead.createdAt}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Isolated Tenant ID:
              </span>
              <span className="font-mono text-slate-600">{lead.tenantId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
