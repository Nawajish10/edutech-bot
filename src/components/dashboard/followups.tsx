import React from "react";
import Link from "next/link";
import { Clock, Phone, ArrowUpRight } from "lucide-react";

interface FollowupItem {
  id: string;
  leadName: string;
  phone: string;
  offer: string;
  scheduledFor: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
}

interface FollowupsProps {
  data: FollowupItem[];
}

export function Followups({ data }: FollowupsProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Upcoming Follow-ups</h3>
          <p className="text-xs text-slate-500">Scheduled counselling & callback reminders</p>
        </div>
        <Link
          href="/leads"
          className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {data.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 truncate">{item.leadName}</p>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    item.priority === "High"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.priority} Priority
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.offer}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-900" />
                  <span className="font-semibold text-slate-700">{item.scheduledFor}</span>
                </span>
                <span>•</span>
                <span>Assigned: {item.assignedTo}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href={`tel:${item.phone}`}
                className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-blue-900 hover:bg-blue-50 border border-slate-200 transition-colors"
                title={`Call ${item.phone}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
