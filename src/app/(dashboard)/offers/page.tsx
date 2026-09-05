"use client";

import React, { useState, useMemo } from "react";
import { useTenant } from "@/lib/tenant-context";
import { MOCK_OFFERS, MOCK_PROMOTION_RULES } from "@/data/mock-offers";
import { OfferCard } from "@/components/offers/offer-card";
import { OfferTable } from "@/components/offers/offer-table";
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Info,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function OffersPage() {
  const { tenant, getOfferLabel } = useTenant();
  const pluralLabel = getOfferLabel(true);
  const singularLabel = getOfferLabel(false);

  const [activeTab, setActiveTab] = useState<"catalog" | "promotions">("catalog");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter offers for the active tenant
  const tenantOffers = useMemo(() => {
    const list = MOCK_OFFERS.filter((o) => o.tenantId === tenant.id);
    return list.length > 0 ? list : MOCK_OFFERS.filter((o) => o.tenantId === "tenant-aakasa");
  }, [tenant.id]);

  // Promotions for tenant
  const tenantPromotions = useMemo(() => {
    return MOCK_PROMOTION_RULES.filter((p) => p.tenantId === tenant.id);
  }, [tenant.id]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    tenantOffers.forEach((o) => set.add(o.category));
    return ["All", ...Array.from(set)];
  }, [tenantOffers]);

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return tenantOffers.filter((o) => {
      const matchesSearch =
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.description.toLowerCase().includes(search.toLowerCase()) ||
        o.category.toLowerCase().includes(search.toLowerCase()) ||
        (o.bestFor && o.bestFor.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedCategory !== "All" && o.category !== selectedCategory) return false;
      return true;
    });
  }, [tenantOffers, search, selectedCategory]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              {pluralLabel} Catalog Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {tenantOffers.length} {pluralLabel} Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized with Google Sheets database: pricing tiers, durations, curriculums, and promotional guardrails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "catalog" && (
            <div className="flex items-center p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-100 text-blue-900 font-bold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-slate-100 text-blue-900 font-bold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => alert(`Add ${singularLabel} dialog will connect to database in Phase 2.`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {singularLabel}</span>
          </button>
        </div>
      </div>

      {/* Tabs between Course Catalog and Promotional Rules */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "catalog"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>{pluralLabel} Catalog ({tenantOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("promotions")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "promotions"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Active Promotional Rules & Disclaimers ({tenantPromotions.length})</span>
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Verified Sheet Banner */}
          {tenant.id === "tenant-aakasa" && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-950 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">
                  Google Sheet Synced: 9 Verified Programs with Full Pricing & Durations
                </p>
                <p className="text-slate-600 leading-relaxed">
                  All 9 official programs have been updated with their verified duration, original fee, displayed offer pricing, core modules, and target audience extracted directly from the spreadsheet.
                </p>
              </div>
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${pluralLabel.toLowerCase()} by title, audience, curriculum...`}
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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

          {/* View Mode Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <OfferTable offers={filteredOffers} />
          )}
        </div>
      )}

      {/* Tab 2: Promotional Rules (from Offers.csv) */}
      {activeTab === "promotions" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Promotional Offers & Agent Rules</h3>
                <p className="text-xs text-slate-500">
                  Extracted from the <code className="font-mono text-slate-700">Offers</code> sheet tab. Guardrails enforce accurate AI responses.
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Discounts
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {tenantPromotions.map((promo) => (
                <div key={promo.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{promo.offer}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                        {promo.validity}
                      </span>
                    </div>
                    <p className="text-slate-700 font-semibold">{promo.details}</p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span><strong>Agent Guardrail:</strong> {promo.agentRule}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium">Source: {promo.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
