"use client";

import React from "react";
import { Conversation, Lead } from "@/types";
import { useTenant } from "@/lib/tenant-context";
import {
  Phone,
  Mail,
  MapPin,
  Tag,
  Calendar,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface ContactPanelProps {
  conversation?: Conversation;
  lead?: Lead;
}

export function ContactPanel({ conversation, lead }: ContactPanelProps) {
  const { getOfferLabel, tenant } = useTenant();
  const offerLabel = getOfferLabel(false);

  if (!conversation) {
    return (
      <div className="w-80 h-full hidden lg:flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-white">
        <p className="text-xs">Select a contact to view profile</p>
      </div>
    );
  }

  return (
    <div className="w-80 h-full hidden lg:flex flex-col bg-white overflow-y-auto select-none">
      {/* Profile Header */}
      <div className="p-5 text-center border-b border-slate-100 bg-slate-50/40">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-900 text-white flex items-center justify-center text-lg font-bold shadow-xs">
          {conversation.contactAvatar || conversation.contactName.slice(0, 2).toUpperCase()}
        </div>
        <h3 className="text-sm font-bold text-slate-900 mt-2.5">
          {conversation.contactName}
        </h3>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          {conversation.contactPhone}
        </p>

        {lead?.status && (
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              {lead.status} Lead
            </span>
          </div>
        )}
      </div>

      {/* Quick Contact Actions */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-100">
        <a
          href={`tel:${conversation.contactPhone}`}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-blue-900" />
          <span>Call</span>
        </a>
        <a
          href={`https://wa.me/${conversation.contactPhone.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Lead Qualification Profile */}
      <div className="p-4 space-y-4 text-xs">
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Qualification Data
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] block">Interested {offerLabel}</span>
                <span className="font-semibold text-slate-800 block">
                  {lead?.offerInterest || "General Inquiry"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] block">Start Preference</span>
                <span className="font-semibold text-slate-800 block">
                  {lead?.preferredStartDate || "Not configured"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] block">Location / City</span>
                <span className="font-semibold text-slate-800 block">
                  {lead?.city || "Unknown"}
                </span>
              </div>
            </div>

            {lead?.email && (
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Email Address</span>
                  <span className="font-semibold text-slate-800 block truncate max-w-[190px]">
                    {lead.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lead Score & Intent */}
        {lead?.score && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-500 font-medium">AI Qualification Score</span>
              <span className="font-bold text-blue-900 font-mono">{lead.score}/100</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-900 rounded-full"
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>
        )}

        {/* Captured Intent & Bot Entities (Google Sheet audit trail) */}
        {(conversation.intent || conversation.capturedEntities) && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Session Intent & Extracted Slots
            </span>
            {conversation.intent && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Classified Intent:</span>
                <span className="font-mono text-blue-900 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  {conversation.intent}
                </span>
              </div>
            )}
            {conversation.capturedEntities && (
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] space-y-1">
                {Object.entries(conversation.capturedEntities).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-slate-500 capitalize">{k}:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[140px]">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Tag className="w-3 h-3" />
            <span>Tags & Flags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {conversation.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {lead?.notes && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Internal Notes
            </span>
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Tenant Isolation info */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Tenant Scope: {tenant.name}</span>
        </div>
      </div>
    </div>
  );
}
