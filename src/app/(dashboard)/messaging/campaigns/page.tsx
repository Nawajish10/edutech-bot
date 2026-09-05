"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";
import { Campaign } from "@/types";
import {
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Eye,
} from "lucide-react";
import { CampaignModal } from "@/components/messaging/campaign-modal";
import Link from "next/link";

export default function CampaignsPage() {
  const { tenant } = useTenant();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCampaigns = () => {
    setIsLoading(true);
    fetch(`/api/campaigns?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.campaigns) setCampaigns(data.campaigns);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, [tenant.id]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Marketing Campaigns
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {campaigns.length} Broadcasts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Orchestrate WhatsApp template campaigns with recipient verification, cost breakdown, and delivery metrics.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">Recipients</th>
                <th className="px-4 py-3">Delivery Funnel</th>
                <th className="px-4 py-3">Estimated Cost</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                    No marketing campaigns created yet. Click &ldquo;New Campaign&rdquo; to launch your first broadcast.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div>{c.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">By {c.createdBy}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-blue-900">
                      {c.templateName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.category === "Marketing"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate">
                      {c.audienceFilter || "Custom List"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 font-mono">{c.validCount} valid</div>
                      {c.excludedCount > 0 && (
                        <div className="text-[10px] text-amber-700">({c.excludedCount} excluded)</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-slate-700">{c.sentCount} sent</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{c.deliveredCount} del.</span>
                        <span>•</span>
                        <span className="text-blue-700">{c.readCount} read</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      ₹{c.estimatedCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{c.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided 6-Step Campaign Modal */}
      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchCampaigns()}
      />
    </div>
  );
}
