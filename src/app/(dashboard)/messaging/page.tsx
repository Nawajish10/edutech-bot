"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";
import { Campaign, WhatsAppTemplate } from "@/types";
import Link from "next/link";
import {
  Send,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { CampaignModal } from "@/components/messaging/campaign-modal";

export default function MessagingOverviewPage() {
  const { tenant } = useTenant();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/templates?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.templates) setTemplates(data.templates);
      })
      .catch(() => {});

    fetch(`/api/campaigns?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.campaigns) setCampaigns(data.campaigns);
      })
      .catch(() => {});
  }, [tenant.id]);

  const approvedCount = templates.filter((t) => t.status === "Approved").length;
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const avgDelivery = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 98.4;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            WhatsApp Admissions Messaging
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Meta Cloud API verified templates, bulk marketing broadcasts, and operational utility messaging.
          </p>
        </div>

        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Approved Templates</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{approvedCount}</h3>
          <span className="text-xs text-emerald-600 font-medium">Ready for broadcast</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Broadcasts Dispatched</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{campaigns.length}</h3>
          <span className="text-xs text-slate-400">All campaigns completed</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Total Recipients Reached</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalSent}</h3>
          <span className="text-xs text-blue-600 font-medium font-mono">{totalDelivered} delivered</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Avg. Delivery SLA</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{avgDelivery}%</h3>
          <span className="text-xs text-emerald-600 font-semibold">High Quality WhatsApp Score</span>
        </div>
      </div>

      {/* 3 Nav Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Templates Module */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Message Templates</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Design, preview, and manage Utility and Marketing templates pre-approved by Meta for WhatsApp outreach.
            </p>
          </div>
          <Link
            href="/messaging/templates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 pt-2"
          >
            <span>Manage Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Campaigns Module */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Marketing Campaigns</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Target prospective student segments with the 6-step campaign wizard, recipient validation, and transparent pricing.
            </p>
          </div>
          <Link
            href="/messaging/campaigns"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 pt-2"
          >
            <span>View Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Message History Module */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Message History &amp; Audit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full audit trail of outbound campaigns, recipient-level delivery logs, timestamps, and cost attribution.
            </p>
          </div>
          <Link
            href="/messaging/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-800 pt-2"
          >
            <span>Audit Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        initialAudienceLabel="All qualified prospective students"
      />
    </div>
  );
}
