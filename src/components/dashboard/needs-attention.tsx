import React from "react";
import Link from "next/link";
import { MessageSquare, ExternalLink } from "lucide-react";

interface AttentionItem {
  id: string;
  name: string;
  course: string;
  timeAgo: string;
  intentBadge: "High Intent" | "Fees Enquiry" | "Human Handoff" | "Counselling";
  phone: string;
  avatar?: string;
  conversationId?: string;
}

interface NeedsAttentionProps {
  items?: AttentionItem[];
}

export function NeedsAttention({ items }: NeedsAttentionProps) {
  const defaultItems: AttentionItem[] = [
    {
      id: "attn-1",
      name: "Rahul Sharma",
      course: "Performance Marketing",
      timeAgo: "2 min ago",
      intentBadge: "High Intent",
      phone: "+91 98201 44521",
      avatar: "RS",
    },
    {
      id: "attn-2",
      name: "Priya Das",
      course: "Digital Marketing Career",
      timeAgo: "12 min ago",
      intentBadge: "Fees Enquiry",
      phone: "+91 97110 88231",
      avatar: "PD",
    },
    {
      id: "attn-3",
      name: "Arjun Mehta",
      course: "SEO & GEO Specialist",
      timeAgo: "34 min ago",
      intentBadge: "Human Handoff",
      phone: "+91 98450 12399",
      avatar: "AM",
    },
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  const badgeStyles: Record<string, string> = {
    "High Intent": "bg-rose-50 text-rose-700 border-rose-200",
    "Fees Enquiry": "bg-amber-50 text-amber-700 border-amber-200",
    "Human Handoff": "bg-purple-50 text-purple-700 border-purple-200",
    "Counselling": "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Needs Your Attention</h3>
          <Link
            href="/inbox"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <span>&gt;</span>
          </Link>
        </div>

        <div className="space-y-3">
          {list.slice(0, 4).map((item) => {
            const badgeClass = badgeStyles[item.intentBadge] || "bg-slate-100 text-slate-700";
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                    {item.avatar || item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-900">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{item.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">{item.timeAgo}</span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 ${badgeClass}`}
                    >
                      {item.intentBadge}
                    </span>
                  </div>

                  {/* Direct WhatsApp / Chat launcher button */}
                  <Link
                    href={`/inbox?phone=${encodeURIComponent(item.phone)}`}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                    title={`Message ${item.name} on WhatsApp`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
