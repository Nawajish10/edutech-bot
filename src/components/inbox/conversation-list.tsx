"use client";

import React, { useState } from "react";
import { Conversation } from "@/types";
import { Search, Bot, User, Filter } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "ai" | "human">("all");

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPhone.includes(search) ||
      c.lastMessageSnippet.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === "ai") return c.mode === "AI Handling";
    if (filterMode === "human") return c.mode === "Human Agent";
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200/80 select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-100 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2 py-0.5 rounded-full font-semibold transition-colors ${
                filterMode === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              onClick={() => setFilterMode("ai")}
              className={`px-2 py-0.5 rounded-full font-semibold transition-colors flex items-center gap-1 ${
                filterMode === "ai"
                  ? "bg-blue-900 text-white"
                  : "bg-blue-50 text-blue-900 hover:bg-blue-100"
              }`}
            >
              <Bot className="w-2.5 h-2.5" />
              AI
            </button>
            <button
              onClick={() => setFilterMode("human")}
              className={`px-2 py-0.5 rounded-full font-semibold transition-colors flex items-center gap-1 ${
                filterMode === "human"
                  ? "bg-emerald-800 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <User className="w-2.5 h-2.5" />
              Human
            </button>
          </div>
          <Filter className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Conversation Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No conversations matching criteria
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3 transition-colors flex items-start gap-3 relative ${
                  isSelected ? "bg-blue-50/70" : "hover:bg-slate-50/80"
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900" />
                )}

                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {conv.contactAvatar || conv.contactName.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {conv.contactName}
                    </p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">
                      {conv.lastMessageAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate mb-1">
                    {conv.lastMessageSnippet}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
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
                      {conv.tags?.[0] && (
                        <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                          {conv.tags[0]}
                        </span>
                      )}
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
