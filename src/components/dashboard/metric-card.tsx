import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  subtext?: string;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-900",
  subtext = "Live",
}: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-tight">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBgColor} ${iconColor} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        {change ? (
          <span
            className={`font-semibold ${
              isPositive ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {change}
          </span>
        ) : (
          <span className="text-slate-400">Current period</span>
        )}
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          {subtext}
        </span>
      </div>
    </div>
  );
}
