import React from "react";
import Link from "next/link";
import { Conversation } from "@/types";
import { Bot, User, ArrowRight } from "lucide-react";

interface RecentConversationsProps {
  conversations: Conversation[];
}

export function RecentConversations({ conversations }: RecentConversationsProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent Conversations</h3>
          <p className="text-xs text-slate-500">Live WhatsApp inquiries across the pipeline</p>
        </div>
        <Link
          href="/inbox"
          className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>Open Inbox</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {conversations.slice(0, 5).map((conv) => (
          <div
            key={conv.id}
            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-slate-50/50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {conv.contactAvatar || conv.contactName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {conv.contactName}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {conv.contactPhone}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                  {conv.lastMessageSnippet}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  conv.mode === "AI Handling"
                    ? "bg-blue-50 text-blue-900 border border-blue-200"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                {conv.mode === "AI Handling" ? (
                  <Bot className="w-2.5 h-2.5" />
                ) : (
                  <User className="w-2.5 h-2.5" />
                )}
                {conv.mode}
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                {conv.lastMessageAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
