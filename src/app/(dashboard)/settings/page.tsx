"use client";

import React, { useState } from "react";
import { useTenant } from "@/lib/tenant-context";
import { MOCK_SETTINGS } from "@/data/mock-settings";
import { BusinessType, OfferType, Organization } from "@/types";
import {
  Building2,
  Bot,
  PhoneCall,
  Bell,
  Save,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

function SettingsView({ tenant }: { tenant: Organization }) {
  const currentSettings =
    MOCK_SETTINGS[tenant.id] || MOCK_SETTINGS["tenant-aakasa"];

  const [activeTab, setActiveTab] = useState<
    "business" | "ai" | "whatsapp" | "notifications"
  >("business");

  const [businessName, setBusinessName] = useState(currentSettings.businessName);
  const [website, setWebsite] = useState(currentSettings.website);
  const [businessType, setBusinessType] = useState<BusinessType>(currentSettings.businessType);
  const [offerType, setOfferType] = useState<OfferType>(currentSettings.offerType);
  const [timezone, setTimezone] = useState(currentSettings.timezone);
  const [currency, setCurrency] = useState(currentSettings.currency);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const businessTypes: BusinessType[] = [
    "Education",
    "Fitness",
    "Real Estate",
    "Consulting",
    "Healthcare",
    "E-Commerce",
    "Other",
  ];

  const offerTypes: OfferType[] = [
    "Courses",
    "Memberships",
    "Properties",
    "Services",
    "Programs",
    "Products",
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Organization Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure branding, business models, AI assistant behavior, and notification channels.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("business")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "business"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Business & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "ai"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "whatsapp"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>WhatsApp Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "notifications"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alerts & Notifications</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Settings changes staged successfully (UI Demonstration).</span>
        </div>
      )}

      {/* Tab: Business & Branding */}
      {activeTab === "business" && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tenant Identity & Business Model</h2>
              <p className="text-xs text-slate-500">
                Core parameters dictating terminology and catalog naming throughout the UI.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>tenant_id: {tenant.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Business Vertical</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                {businessTypes.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Generic Offer Terminology Model
              </label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value as OfferType)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                {offerTypes.map((ot) => (
                  <option key={ot} value={ot}>
                    {ot} (e.g. {ot === "Courses" ? "Education" : ot === "Memberships" ? "Fitness" : "Services"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Display Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: AI Assistant */}
      {activeTab === "ai" && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900">AI Assistant Prompt Directive</h2>
          <p className="text-slate-500">
            Define conversational persona guidelines and threshold rules for lead qualification.
          </p>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Welcome Greeting Message</label>
            <textarea
              rows={3}
              defaultValue={currentSettings.autoReplyGreeting}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Consecutive Ambiguous Messages before Human Advisor Escalation
            </label>
            <input
              type="number"
              defaultValue={currentSettings.fallbackToHumanThreshold}
              className="w-28 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab: WhatsApp Rules */}
      {activeTab === "whatsapp" && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900">WhatsApp Messaging Rules</h2>
          <p className="text-slate-500">
            Meta 24-hour customer care window and message template compliance rules.
          </p>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-1">
            <p className="font-semibold">Meta WhatsApp Cloud API Guidelines</p>
            <p className="text-slate-600 leading-relaxed">
              Standard inbound messages from customers initiate a free-form 24-hour service session. Outbound messages sent outside this window must utilize pre-approved Meta message templates.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900">Alert Dispatch Channels</h2>
          <p className="text-slate-500">
            Receive real-time alerts when high-intent leads or urgent human takeovers occur.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Escalation Email</label>
              <input
                type="email"
                defaultValue={currentSettings.notificationsEmail}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Emergency WhatsApp Number</label>
              <input
                type="tel"
                defaultValue={currentSettings.notificationsWhatsapp}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { tenant } = useTenant();
  return <SettingsView key={tenant.id} tenant={tenant} />;
}
