import React from "react";

interface AIPerformanceProps {
  data?: Array<{ metric: string; value: string; description: string; status: string }>;
  resolutionRate?: string;
  avgResponseTime?: string;
  handoffRate?: string;
  modelName?: string;
  status?: string;
}

export function AIPerformance({
  resolutionRate = "75%",
  avgResponseTime = "12 sec",
  handoffRate = "25%",
  modelName = "GPT-4o (via OpenRouter)",
  status = "Operational",
}: AIPerformanceProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">AI Performance</h3>
        </div>

        {/* 3 Metrics in a row matching mockup */}
        <div className="grid grid-cols-3 gap-2 text-left">
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">AI Resolution Rate</p>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 font-mono">{resolutionRate}</h4>
            <span className="text-[10px] text-slate-400">184 / 246</span>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Avg. AI Response Time</p>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 font-mono">{avgResponseTime}</h4>
            <span className="text-[10px] text-slate-400">First response</span>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Human Handoff Rate</p>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 font-mono">{handoffRate}</h4>
            <span className="text-[10px] text-slate-400">62 conversations</span>
          </div>
        </div>
      </div>

      {/* Model & Operational Status Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-[11px] text-slate-400 block">Model</span>
          <span className="font-semibold text-slate-800">{modelName}</span>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Status</span>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
