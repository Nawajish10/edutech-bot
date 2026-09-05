"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface SourceItem {
  source: string;
  count: number;
  percentage: number;
}

interface SourceBreakdownProps {
  data: SourceItem[];
}

export function SourceBreakdown({ data }: SourceBreakdownProps) {
  // Mockup source breakdown colors
  const sourceColors: Record<string, string> = {
    "WhatsApp Organic": "#2563eb", // Blue
    "Google Ads": "#38bdf8", // Cyan
    "Instagram": "#ec4899", // Pink
    "Website": "#10b981", // Emerald
    "Other": "#a855f7", // Purple
  };

  const defaultSources: SourceItem[] = [
    { source: "WhatsApp Organic", count: 103, percentage: 42 },
    { source: "Google Ads", count: 76, percentage: 31 },
    { source: "Instagram", count: 42, percentage: 17 },
    { source: "Website", count: 17, percentage: 7 },
    { source: "Other", count: 8, percentage: 3 },
  ];

  const chartData = data && data.length > 0 ? data : defaultSources;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900">Lead Sources</h3>
      </div>

      <div className="flex items-center justify-between gap-4 h-full py-2">
        {/* Donut Ring Chart */}
        <div className="w-36 h-36 flex-shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val: unknown) => [`${val}%`, "Share"]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  fontSize: "11px",
                }}
              />
              <Pie
                data={chartData}
                dataKey="percentage"
                nameKey="source"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.source}`}
                    fill={sourceColors[entry.source] || "#94a3b8"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with percentages */}
        <div className="flex-1 space-y-2">
          {chartData.map((entry) => (
            <div key={entry.source} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: sourceColors[entry.source] || "#94a3b8" }}
                />
                <span className="text-slate-600 font-medium truncate">{entry.source}</span>
              </div>
              <span className="font-bold text-slate-900 font-mono ml-2">
                {entry.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
