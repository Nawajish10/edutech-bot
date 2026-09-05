import React from "react";

interface FunnelStep {
  stage: string;
  count: number;
  percentage: number;
}

interface FunnelProps {
  data: FunnelStep[];
  conversionRate?: string;
}

export function Funnel({ data, conversionRate = "7.3%" }: FunnelProps) {
  // Mockup colors for each stage
  const stageColors: Record<string, string> = {
    "WhatsApp Conversations": "bg-blue-600",
    "Engaged": "bg-sky-400",
    "Qualified": "bg-emerald-500",
    "Counseling": "bg-amber-500",
    "Admissions Influenced": "bg-purple-600",
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Admissions Funnel</h3>
        </div>

        <div className="space-y-3.5">
          {data.map((step) => {
            const barColor = stageColors[step.stage] || "bg-blue-600";
            return (
              <div key={step.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{step.stage}</span>
                  <span className="font-bold text-slate-900 font-mono">{step.count}</span>
                </div>
                {/* Thick styled bar matching mockup */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(step.percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Funnel Conversion Rate</span>
        <span className="text-sm font-bold text-emerald-600 font-mono">{conversionRate}</span>
      </div>
    </div>
  );
}
