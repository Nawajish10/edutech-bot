import React from "react";
import { Zap, MessageSquare, Database } from "lucide-react";

export default function PlatformUsagePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Usage & Consumption Metering</h1>
        <p className="text-xs text-slate-400 mt-1">
          WhatsApp conversation consumption, AI token consumption, and database storage meters per tenant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>WhatsApp Messages (Month)</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">18,420</p>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: "36%" }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">36% of 50,000 monthly quota</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>LLM Tokens Processed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">4.2M</p>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "42%" }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">42% of 10M token allowance</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Storage & Media Records</span>
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">1.8 GB</p>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: "18%" }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">18% of 10 GB platform tier</span>
        </div>
      </div>
    </div>
  );
}
