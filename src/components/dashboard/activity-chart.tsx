"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface TrendDataPoint {
  date: string;
  total: number;
  aiHandled: number;
  humanHandled: number;
}

export interface ActivityDataPoint {
  time: string;
  aiMessages: number;
  humanMessages: number;
  leadsCaptured: number;
}

interface ActivityChartProps {
  data?: Array<TrendDataPoint | ActivityDataPoint>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  const [granularity, setGranularity] = useState<"Daily" | "Weekly">("Daily");

  const defaultData: TrendDataPoint[] = [
    { date: "27 Aug", total: 48, aiHandled: 36, humanHandled: 12 },
    { date: "28 Aug", total: 125, aiHandled: 92, humanHandled: 33 },
    { date: "29 Aug", total: 102, aiHandled: 76, humanHandled: 26 },
    { date: "30 Aug", total: 168, aiHandled: 126, humanHandled: 42 },
    { date: "31 Aug", total: 144, aiHandled: 108, humanHandled: 36 },
    { date: "1 Sep", total: 188, aiHandled: 141, humanHandled: 47 },
    { date: "2 Sep", total: 152, aiHandled: 114, humanHandled: 38 },
    { date: "3 Sep", total: 204, aiHandled: 153, humanHandled: 51 },
  ];

  const chartData: TrendDataPoint[] = React.useMemo(() => {
    if (!data || data.length === 0) return defaultData;
    return data.map((d) => {
      if ("date" in d) return d as TrendDataPoint;
      const act = d as ActivityDataPoint;
      return {
        date: act.time,
        total: act.aiMessages + act.humanMessages,
        aiHandled: act.aiMessages,
        humanHandled: act.humanMessages,
      };
    });
  }, [data]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Conversations Trend</h3>
        </div>

        {/* Granularity Dropdown */}
        <div className="relative">
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as "Daily" | "Weekly")}
            className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Legend Dots matching mockup */}
      <div className="flex items-center gap-4 text-xs mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-slate-600 font-medium">Conversations</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span className="text-slate-600 font-medium">AI Handled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-600 font-medium">Human Handled</span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Conversations"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#2563eb" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="aiHandled"
              name="AI Handled"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#38bdf8" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="humanHandled"
              name="Human Handled"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
