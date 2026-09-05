"use client";

import React, { useState, useMemo } from "react";
import { useTenant } from "@/lib/tenant-context";
import {
  MOCK_KNOWLEDGE_BASE,
  MOCK_SOURCES,
  MOCK_PITCH_OPPORTUNITIES,
} from "@/data/mock-knowledge";
import {
  MOCK_BOT_FLOW_STAGES,
  MOCK_LEAD_CAPTURE_SLOTS,
} from "@/data/mock-bot-flow";
import {
  Search,
  BookOpen,
  HelpCircle,
  GitMerge,
  ListOrdered,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";

export default function KnowledgeBasePage() {
  const { tenant } = useTenant();

  const [activeTab, setActiveTab] = useState<
    "kb" | "faqs" | "flow" | "slots" | "pitch" | "sources"
  >("kb");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Knowledge base items (category != FAQs)
  const kbItems = useMemo(() => {
    return MOCK_KNOWLEDGE_BASE.filter(
      (item) => item.tenantId === tenant.id && item.category !== "FAQs"
    );
  }, [tenant.id]);

  // Verified FAQ items
  const faqItems = useMemo(() => {
    return MOCK_KNOWLEDGE_BASE.filter(
      (item) => item.tenantId === tenant.id && item.category === "FAQs"
    );
  }, [tenant.id]);

  // Categories for KB tab
  const kbCategories = useMemo(() => {
    const set = new Set<string>();
    kbItems.forEach((item) => set.add(item.category));
    return ["All", ...Array.from(set)];
  }, [kbItems]);

  // Filtered KB items
  const filteredKb = useMemo(() => {
    return kbItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        (item.key && item.key.toLowerCase().includes(search.toLowerCase())) ||
        (item.agentUsage && item.agentUsage.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      return true;
    });
  }, [kbItems, search, selectedCategory]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqItems.filter(
      (f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.content.toLowerCase().includes(search.toLowerCase()) ||
        (f.missingDetailEscalation &&
          f.missingDetailEscalation.toLowerCase().includes(search.toLowerCase()))
    );
  }, [faqItems, search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              AI Knowledge Base & Workflow Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              Google Sheet Synchronized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full synchronization with 10 Google Sheet tabs: Brand Knowledge, FAQs, Bot Flow State Engine, Lead Capture Slots, and Strategy.
          </p>
        </div>
      </div>

      {/* Navigation Tabs for All Sheet Entities */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab("kb");
            setSearch("");
          }}
          className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === "kb"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base ({kbItems.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("faqs");
            setSearch("");
          }}
          className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === "faqs"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Verified FAQs ({faqItems.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("flow");
            setSearch("");
          }}
          className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === "flow"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <GitMerge className="w-3.5 h-3.5 text-indigo-600" />
          <span>Bot Flow Engine ({MOCK_BOT_FLOW_STAGES.length} Stages)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("slots");
            setSearch("");
          }}
          className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === "slots"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lead Capture Slots ({MOCK_LEAD_CAPTURE_SLOTS.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("pitch");
            setSearch("");
          }}
          className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === "pitch"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Pitch & Value Gaps ({MOCK_PITCH_OPPORTUNITIES.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("sources");
            setSearch("");
          }}
          className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === "sources"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span>Verified Sources ({MOCK_SOURCES.length})</span>
        </button>
      </div>

      {/* TAB 1: KNOWLEDGE BASE (21 Items) */}
      {activeTab === "kb" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search knowledge items, keys, contents..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {kbCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-900 text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKb.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-100 uppercase">
                      {item.category}
                    </span>
                    {item.key && (
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        key: {item.key}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    {item.title}
                  </h3>

                  <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 text-xs text-slate-800 leading-relaxed font-medium mb-2">
                    {item.content}
                  </div>

                  {item.agentUsage && (
                    <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Agent Directive:</strong> {item.agentUsage}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Source: {item.source || "Website"}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.lastUpdated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED FAQS (9 Items) */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search verified questions and answers..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-900 flex-shrink-0" />
                    <span>{faq.title}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                    Verified Q&A
                  </span>
                </div>

                <div className="pl-6 text-xs text-slate-700 leading-relaxed bg-blue-50/30 p-3 rounded-lg border border-blue-100/60">
                  <p className="font-semibold text-slate-900 mb-0.5">Verified Response:</p>
                  <p>{faq.content}</p>
                </div>

                {faq.missingDetailEscalation && (
                  <div className="pl-6 flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Escalation Rule: </span>
                      <span>{faq.missingDetailEscalation}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BOT FLOW ENGINE (8 Stages from Bot_Flow.csv) */}
      {activeTab === "flow" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
            <GitMerge className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Conversational State Machine Architecture</p>
              <p className="text-slate-600">
                Extracted directly from the <code className="font-mono text-indigo-900">Bot_Flow</code> sheet. Governs how the WhatsApp AI Assistant executes transitions from discovery to recommendation and counsellor handoff.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Trigger Condition</th>
                    <th className="px-4 py-3">AI Agent Action</th>
                    <th className="px-4 py-3">Next Inbound Question</th>
                    <th className="px-4 py-3">Output / Tool Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_BOT_FLOW_STAGES.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {s.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">
                        {s.trigger}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {s.agentAction}
                      </td>
                      <td className="px-4 py-3 text-blue-900 italic font-serif">
                        &ldquo;{s.nextQuestion}&rdquo;
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          {s.outputToolAction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEAD CAPTURE SLOTS (13 Fields from Lead_Capture.csv) */}
      {activeTab === "slots" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-3">
            <ListOrdered className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Slot-Filling Qualification Schema</p>
              <p className="text-slate-600">
                Extracted from the <code className="font-mono text-emerald-900">Lead_Capture</code> sheet. Defines required vs. recommended slots captured by the AI agent before initiating human counsellor handoff.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Slot Field</th>
                    <th className="px-4 py-3">Requirement</th>
                    <th className="px-4 py-3">Qualification Purpose</th>
                    <th className="px-4 py-3">Example / Allowed Values</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_LEAD_CAPTURE_SLOTS.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs">
                          {slot.field}
                        </code>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            slot.required.startsWith("Yes")
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : slot.required === "Recommended"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {slot.required}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {slot.purpose}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {slot.exampleValues}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PITCH & VALUE OPPORTUNITIES (7 Rows from Pitch_Opportunities.csv) */}
      {activeTab === "pitch" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Automation Gap & Pitch Strategy Repository</p>
              <p className="text-slate-600">
                Extracted from the <code className="font-mono text-amber-900">Pitch_Opportunities</code> sheet. Strategic areas for platform deployment and ROI demonstration.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_PITCH_OPPORTUNITIES.map((opp) => (
              <div
                key={opp.id}
                className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase ${
                      opp.priority === "High"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    Priority: {opp.priority}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Evidence: {opp.evidence}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Observed Operational Bottleneck
                  </h4>
                  <p className="text-sm font-semibold text-slate-900">
                    {opp.observedOpportunity}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                    <span className="text-blue-900 font-bold block mb-0.5">What To Propose:</span>
                    <p className="text-slate-700">{opp.whatToPropose}</p>
                  </div>

                  <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <span className="text-emerald-800 font-bold block mb-0.5">Business ROI / Value:</span>
                    <p className="text-slate-700">{opp.businessValue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SOURCES (4 Rows from Sources.csv) */}
      {activeTab === "sources" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Verified Web Sources & Data Provenance</h3>
              <p className="text-xs text-slate-500">
                Extracted from the <code className="font-mono text-slate-700">Sources</code> sheet tab.
              </p>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {MOCK_SOURCES.map((src) => (
                <div key={src.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-900 text-sm">{src.source}</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-700 text-xs"
                    >
                      <span className="truncate max-w-xs sm:max-w-md">{src.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                  <p className="text-slate-700">
                    <strong>Extracted Content:</strong> {src.whatWasExtracted}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Note:</strong> {src.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
