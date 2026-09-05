"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";
import { ConversationList } from "@/components/inbox/conversation-list";
import { ConversationThread } from "@/components/inbox/conversation-thread";
import { ContactPanel } from "@/components/inbox/contact-panel";
import { Conversation, Message, Organization, Lead } from "@/types";

import { useSearchParams } from "next/navigation";

function InboxView({ tenant }: { tenant: Organization }) {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live conversations and leads asynchronously from Google Sheets backend
  useEffect(() => {
    let isMounted = true;
    const targetPhone = searchParams.get("phone");
    const targetConvId = searchParams.get("conversationId");

    Promise.all([
      fetch(`/api/conversations?tenantId=${tenant.id}`).then((res) => res.json()),
      fetch(`/api/leads?tenantId=${tenant.id}`).then((res) => res.json()),
    ])
      .then(([convData, leadData]) => {
        if (!isMounted) return;

        if (convData.conversations && convData.conversations.length > 0) {
          setConversations(convData.conversations);

          let initialId = convData.conversations[0].id;
          if (targetConvId) {
            const found = convData.conversations.find((c: Conversation) => c.id === targetConvId);
            if (found) initialId = found.id;
          } else if (targetPhone) {
            const cleanTarget = targetPhone.replace(/\D/g, "");
            const found = convData.conversations.find((c: Conversation) =>
              c.contactPhone.replace(/\D/g, "").includes(cleanTarget)
            );
            if (found) initialId = found.id;
          }

          setActiveId(initialId);
        }

        if (leadData.leads) {
          setLeads(leadData.leads);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Inbox data fetch error:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tenant.id]);

  // Fetch messages for active conversation asynchronously
  useEffect(() => {
    if (!activeId) return;
    let isMounted = true;

    fetch(`/api/messages?conversationId=${activeId}&tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.messages) {
          setMessagesMap((prev) => ({ ...prev, [activeId]: data.messages }));
        }
      })
      .catch((err) => console.error("Error fetching messages:", err));

    return () => {
      isMounted = false;
    };
  }, [activeId, tenant.id]);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const activeMessages = messagesMap[activeId] || [];
  const activeLead = leads.find(
    (l) =>
      l.contactId === activeConversation?.contactId ||
      l.phone === activeConversation?.contactPhone
  );

  // Send message through server-side WhatsApp Cloud API service
  const handleSendMessage = async (content: string) => {
    if (!activeId) return;

    // Optimistic UI update
    const optimisticMessage: Message = {
      id: `msg-opt-${Date.now()}`,
      tenantId: tenant.id,
      conversationId: activeId,
      senderType: "agent",
      senderName: "Human Advisor",
      content,
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date()),
      deliveryStatus: "sent",
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), optimisticMessage],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMessageSnippet: content,
              lastMessageAt: "Just now",
            }
          : c
      )
    );

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeId,
          messageText: content,
          requestedTenant: tenant.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setMessagesMap((prev) => ({ ...prev, [activeId]: data.messages }));
        }
      }
    } catch (err) {
      console.error("Failed to send message to server:", err);
    }
  };

  const handleToggleMode = (newMode: "AI Handling" | "Human Agent") => {
    if (!activeId) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              mode: newMode,
              assignedTo: newMode === "Human Agent" ? "Human Advisor" : "AI Assistant",
            }
          : c
      )
    );

    const systemMsg: Message = {
      id: `sys-${Date.now()}`,
      tenantId: tenant.id,
      conversationId: activeId,
      senderType: "system",
      content:
        newMode === "Human Agent"
          ? "Conversation taken over by Human Advisor. AI assistant paused."
          : "Conversation returned to AI Assistant for autonomous qualification.",
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date()),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), systemMsg],
    }));
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600">Loading live conversations from Google Sheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Column 1: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col h-full overflow-hidden">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeId}
          onSelectConversation={(id) => setActiveId(id)}
        />
      </div>

      {/* Column 2: Chat Thread */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F0F2F5]/60 relative">
        <ConversationThread
          conversation={activeConversation}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
          onToggleMode={handleToggleMode}
        />
      </div>

      {/* Column 3: Contact & Lead Details Panel */}
      <div className="hidden xl:block w-80 lg:w-88 flex-shrink-0 bg-white border-l border-slate-200/80 h-full overflow-y-auto">
        <ContactPanel conversation={activeConversation} lead={activeLead} />
      </div>
    </div>
  );
}

export default function InboxPage() {
  const { tenant } = useTenant();
  return (
    <React.Suspense
      fallback={
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-600">Loading inbox...</p>
          </div>
        </div>
      }
    >
      <InboxView key={tenant.id} tenant={tenant} />
    </React.Suspense>
  );
}
