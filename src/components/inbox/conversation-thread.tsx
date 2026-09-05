"use client";

import React from "react";
import { Conversation, Message } from "@/types";
import { MessageComposer } from "./message-composer";
import {
  Bot,
  User,
  ShieldCheck,
  CheckCheck,
  UserCheck,
  RotateCcw,
} from "lucide-react";

interface ConversationThreadProps {
  conversation?: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onToggleMode: (newMode: "AI Handling" | "Human Agent") => void;
}

export function ConversationThread({
  conversation,
  messages,
  onSendMessage,
  onToggleMode,
}: ConversationThreadProps) {
  if (!conversation) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-slate-50/50 p-8 text-center text-slate-400">
        <p className="text-sm font-medium">Select a conversation from the left to view messages</p>
      </div>
    );
  }

  const isAI = conversation.mode === "AI Handling";

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50/40 border-r border-slate-200/80">
      {/* Top Conversation Header */}
      <div className="h-16 px-4 bg-white border-b border-slate-200/80 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {conversation.contactAvatar || conversation.contactName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 truncate">
                {conversation.contactName}
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {conversation.contactPhone}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                WhatsApp Direct
              </span>
              <span>•</span>
              <span className="truncate">Assigned: {conversation.assignedTo || "Unassigned"}</span>
            </div>
          </div>
        </div>

        {/* Mode Indicator & Take Over Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isAI
                ? "bg-blue-50 text-blue-900 border border-blue-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span>{conversation.mode}</span>
          </span>

          {isAI ? (
            <button
              onClick={() => onToggleMode("Human Agent")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-900 text-white hover:bg-blue-800 transition-colors shadow-xs"
              title="Pause AI and take over conversation manually"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Take Over</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleMode("AI Handling")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Return control back to AI Assistant"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-900" />
              <span>Hand Back to AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isCustomer = msg.senderType === "customer";
          const isSystem = msg.senderType === "system";
          const isAi = msg.senderType === "ai";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-medium text-amber-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>{msg.content}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
            >
              {/* Sender Pill */}
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                {isAi && (
                  <span className="flex items-center gap-1 font-semibold text-blue-900">
                    <Bot className="w-2.5 h-2.5" />
                    AI Assistant
                  </span>
                )}
                {!isCustomer && !isAi && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-800">
                    <User className="w-2.5 h-2.5" />
                    {msg.senderName || "Human Advisor"}
                  </span>
                )}
                {isCustomer && (
                  <span className="font-semibold text-slate-600">
                    {conversation.contactName}
                  </span>
                )}
                {msg.botState && (
                  <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-mono text-[9px] border border-slate-200">
                    state: {msg.botState}
                  </span>
                )}
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-md md:max-w-lg rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap shadow-2xs ${
                  isCustomer
                    ? "bg-white text-slate-900 border border-slate-200 rounded-tl-xs"
                    : isAi
                    ? "bg-blue-900 text-white border border-blue-950 rounded-tr-xs"
                    : "bg-emerald-800 text-white border border-emerald-900 rounded-tr-xs"
                }`}
              >
                {msg.content}

                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    isCustomer ? "text-slate-400" : "text-white/70"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isCustomer && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Composer */}
      <MessageComposer onSendMessage={onSendMessage} />
    </div>
  );
}
