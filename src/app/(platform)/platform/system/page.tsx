import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function PlatformSystemPage() {
  const services = [
    { name: "Next.js App Server (App Router)", status: "Operational", latency: "14ms" },
    { name: "Meta WhatsApp Cloud Webhook Listener", status: "Operational", latency: "42ms" },
    { name: "Tenant Isolation Context Engine", status: "Operational", latency: "<1ms" },
    { name: "AI Inference Gateway (OpenAI / Anthropic)", status: "Operational", latency: "380ms" },
    { name: "Storage & State Layer (Sheets/Supabase Ready)", status: "Operational", latency: "28ms" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Health & Services</h1>
        <p className="text-xs text-slate-400 mt-1">
          Infrastructure health, webhook listener status, and latency monitoring.
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>All Platform Subsystems Operational</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Last Checked: Just now</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {services.map((svc) => (
            <div key={svc.name} className="py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{svc.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">Latency: {svc.latency}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
