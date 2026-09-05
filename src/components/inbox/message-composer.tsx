"use client";

import React, { useState } from "react";
import { Send, Paperclip, Smile, Sparkles } from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSendMessage, disabled = false }: MessageComposerProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled) return;
    onSendMessage(content.trim());
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200/80">
      <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-900/10 focus-within:border-blue-900 focus-within:bg-white transition-all">
        <button
          type="button"
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          title="Attach media or template"
          disabled={disabled}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message (Enter to send, Shift+Enter for newline)..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 resize-none focus:outline-none min-h-[36px] max-h-28 py-1.5"
        />

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="AI draft suggestion"
            disabled={disabled}
          >
            <Sparkles className="w-4 h-4 text-blue-900" />
          </button>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Insert emoji"
            disabled={disabled}
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!content.trim() || disabled}
            className="p-2 bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-xs"
            title="Send WhatsApp message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>
  );
}
