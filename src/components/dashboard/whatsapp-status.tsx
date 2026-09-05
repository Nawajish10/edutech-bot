"use client";

import React from "react";
import Link from "next/link";
import { WhatsAppConnection } from "@/types";
import { PhoneCall, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

interface WhatsAppStatusProps {
  connection?: WhatsAppConnection;
}

export function WhatsAppStatus({ connection }: WhatsAppStatusProps) {
  if (!connection) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">WhatsApp Cloud API Channel</h3>
            <p className="text-xs text-slate-500">Official Meta WhatsApp Business Account</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{connection.connectionStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50/70 border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Business Display</span>
          <p className="font-bold text-slate-800 truncate mt-0.5">{connection.businessName}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone Number</span>
          <p className="font-bold text-slate-800 font-mono mt-0.5">{connection.displayPhoneNumber}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quality Rating</span>
          <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {connection.qualityRating} Tier
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Webhook Sync</span>
          <p className="font-bold text-slate-700 mt-0.5 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-blue-900" />
            {connection.webhookStatus} ({connection.lastSyncAt})
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Credentials isolated per tenant ID</span>
        </div>

        <Link
          href="/whatsapp"
          className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>Manage WhatsApp Settings</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
