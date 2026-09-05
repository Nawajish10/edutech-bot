"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";
import { WhatsAppTemplate, TemplateCategory } from "@/types";
import {
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Search,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function TemplatesContent() {
  const { tenant } = useTenant();
  const searchParams = useSearchParams();

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Create Template Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTplName, setNewTplName] = useState("");
  const [newTplCategory, setNewTplCategory] = useState<TemplateCategory>("Marketing");
  const [newTplLanguage, setNewTplLanguage] = useState("en");
  const [newTplHeaderText, setNewTplHeaderText] = useState("");
  const [newTplBody, setNewTplBody] = useState("");
  const [newTplFooter, setNewTplFooter] = useState("Reply STOP to unsubscribe");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Template Preview Drawer / Modal
  const [previewTemplate, setPreviewTemplate] = useState<WhatsAppTemplate | null>(null);

  useEffect(() => {
    const qSearch = searchParams.get("search");
    if (qSearch) setSearch(qSearch);
  }, [searchParams]);

  const loadTemplates = () => {
    setIsLoading(true);
    fetch(`/api/templates?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.templates) setTemplates(data.templates);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTemplates();
  }, [tenant.id]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplName || !newTplBody) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTplName,
          category: newTplCategory,
          language: newTplLanguage,
          headerType: newTplHeaderText ? "TEXT" : "NONE",
          headerText: newTplHeaderText,
          body: newTplBody,
          footer: newTplFooter,
          tenantId: tenant.id,
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setNewTplName("");
        setNewTplBody("");
        loadTemplates();
      }
    } catch (err) {
      console.error("Template creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTemplates = templates.filter((tpl) => {
    if (categoryFilter !== "All" && tpl.category !== categoryFilter) return false;
    if (
      search &&
      !tpl.name.toLowerCase().includes(search.toLowerCase()) &&
      !tpl.body.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              WhatsApp Message Templates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {templates.length} Templates
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pre-approved Meta WhatsApp templates distinguishing transactional Utility and promotional Marketing outreach.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Marketing", "Utility"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                categoryFilter === cat
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat === "All" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => {
          const isMarketing = tpl.category === "Marketing";

          return (
            <div
              key={tpl.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{tpl.name}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                      Lang: {tpl.language}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMarketing
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {tpl.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {tpl.status}
                    </span>
                  </div>
                </div>

                {/* Body snippet */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
                  {tpl.headerText && <p className="font-bold text-slate-900 mb-1">{tpl.headerText}</p>}
                  <p className="line-clamp-4">{tpl.body}</p>
                  {tpl.footer && <p className="text-[10px] text-slate-400 mt-2 font-sans">{tpl.footer}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  Rate: {isMarketing ? "₹0.72 (Mktg)" : "₹0.35 (Util)"}
                </span>
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-900 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                >
                  Preview Full
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">WhatsApp Template Preview</h3>
              <button onClick={() => setPreviewTemplate(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-[#E5DDD5]/40 space-y-3">
              {/* WhatsApp Bubble Simulation */}
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-xs space-y-2 text-xs text-slate-800">
                {previewTemplate.headerText && (
                  <p className="font-bold text-slate-900">{previewTemplate.headerText}</p>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{previewTemplate.body}</p>
                {previewTemplate.footer && (
                  <p className="text-[10px] text-slate-400 pt-1">{previewTemplate.footer}</p>
                )}

                {previewTemplate.buttons && previewTemplate.buttons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {previewTemplate.buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="py-1.5 text-center text-xs font-semibold text-blue-600 border border-slate-200 rounded-lg bg-slate-50"
                      >
                        {btn.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-1.5 bg-blue-900 text-white font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Submit New WhatsApp Template</h3>
                <p className="text-xs text-slate-500">Requires Meta review prior to production broadcasts.</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Template Identifier Name *</label>
                <input
                  type="text"
                  required
                  value={newTplName}
                  onChange={(e) => setNewTplName(e.target.value)}
                  placeholder="e.g. scholarship_deadline_reminder"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newTplCategory}
                    onChange={(e) => setNewTplCategory(e.target.value as TemplateCategory)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="Marketing">Marketing (Promotional)</option>
                    <option value="Utility">Utility (Transactional)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Language</label>
                  <select
                    value={newTplLanguage}
                    onChange={(e) => setNewTplLanguage(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Header (Optional)</label>
                <input
                  type="text"
                  value={newTplHeaderText}
                  onChange={(e) => setNewTplHeaderText(e.target.value)}
                  placeholder="e.g. Important Admissions Update"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Body Text *</label>
                <textarea
                  rows={4}
                  required
                  value={newTplBody}
                  onChange={(e) => setNewTplBody(e.target.value)}
                  placeholder="Hello {{1}}, your application for {{2}} has been approved. Please confirm..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900 font-sans"
                />
                <p className="text-[11px] text-slate-400 mt-1">Use {"{{1}}"}, {"{{2}}"} for dynamic variables.</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Footer (Optional)</label>
                <input
                  type="text"
                  value={newTplFooter}
                  onChange={(e) => setNewTplFooter(e.target.value)}
                  placeholder="e.g. Reply STOP to opt out"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Submit Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
        </div>
      }
    >
      <TemplatesContent />
    </React.Suspense>
  );
}

