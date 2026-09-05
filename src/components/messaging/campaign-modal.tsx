"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";
import { WhatsAppTemplate, Campaign } from "@/types";
import {
  X,
  Send,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calculator,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLeadIds?: string[];
  initialAudienceLabel?: string;
  onSuccess?: (campaign: Campaign) => void;
}

export function CampaignModal({
  isOpen,
  onClose,
  initialLeadIds = [],
  initialAudienceLabel,
  onSuccess,
}: CampaignModalProps) {
  const { tenant } = useTenant();

  // Wizard Steps: 1. Audience -> 2. Template -> 3. Validate -> 4. Cost -> 5. Review -> 6. Result
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form State
  const [campaignName, setCampaignName] = useState("");
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Validation State
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    validRecipients: Array<{ leadId: string; name: string; phone: string; course: string }>;
    excludedRecipients: Array<{ leadId: string; name: string; phone: string; reason: string }>;
    estimatedCost: number;
    ratePerMessage: number;
    currency: string;
    template: WhatsAppTemplate | null;
  } | null>(null);

  // Sending State
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<Campaign | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load templates on open
  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingTemplates(true);
    fetch(`/api/templates?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.templates) {
          // Filter to approved templates suitable for sending
          const approved = data.templates.filter((t: WhatsAppTemplate) => t.status === "Approved");
          setTemplates(approved.length > 0 ? approved : data.templates);
          if (approved.length > 0) {
            setSelectedTemplateId(approved[0].id);
          }
        }
      })
      .catch((err) => console.error("Error loading templates:", err))
      .finally(() => setIsLoadingTemplates(false));

    // Reset wizard
    setStep(1);
    setCampaignName(`Admissions Broadcast - ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`);
    setValidationResult(null);
    setSendResult(null);
    setErrorMessage("");
  }, [isOpen, tenant.id]);

  if (!isOpen) return null;

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  // Run validation
  const handleValidate = async () => {
    if (!selectedTemplateId) {
      setErrorMessage("Please select a template to continue.");
      return;
    }
    setIsValidating(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/campaigns/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: initialLeadIds,
          templateId: selectedTemplateId,
          requestedTenant: tenant.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Audience validation failed.");
      } else {
        setValidationResult(data);
        setStep(3); // Step 3: Validation
      }
    } catch (err) {
      setErrorMessage(String(err));
    } finally {
      setIsValidating(false);
    }
  };

  // Run dispatch
  const handleDispatch = async () => {
    setIsSending(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignName.trim() || "Admissions Campaign",
          templateId: selectedTemplateId,
          leadIds: initialLeadIds,
          requestedTenant: tenant.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to dispatch campaign.");
      } else {
        setSendResult(data.campaign);
        setStep(6);
        if (onSuccess) onSuccess(data.campaign);
      }
    } catch (err) {
      setErrorMessage(String(err));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                <Send className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Send WhatsApp Template Campaign</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step} of 6 • Meta Cloud API Compliant
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="grid grid-cols-6 h-1 bg-slate-100">
          <div className={`h-full transition-all ${step >= 1 ? "bg-blue-900" : "bg-transparent"}`} />
          <div className={`h-full transition-all ${step >= 2 ? "bg-blue-900" : "bg-transparent"}`} />
          <div className={`h-full transition-all ${step >= 3 ? "bg-blue-900" : "bg-transparent"}`} />
          <div className={`h-full transition-all ${step >= 4 ? "bg-blue-900" : "bg-transparent"}`} />
          <div className={`h-full transition-all ${step >= 5 ? "bg-blue-900" : "bg-transparent"}`} />
          <div className={`h-full transition-all ${step >= 6 ? "bg-emerald-600" : "bg-transparent"}`} />
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: AUDIENCE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Campaign Title / Reference
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. August Merit Waiver Admissions"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-900" />
                    <h4 className="text-xs font-bold text-slate-900">Target Audience</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900">
                    {initialLeadIds.length > 0 ? `${initialLeadIds.length} Selected Leads` : "All Qualified Leads"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {initialAudienceLabel || "Leads selected from current CRM filters or active admissions pipeline."}
                </p>
                <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Scoped strictly to {tenant.name} tenant contacts</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Choose Approved WhatsApp Message Template
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Only Meta-approved templates can be broadcast outside the 24-hour customer care window.
                </p>

                {isLoadingTemplates ? (
                  <div className="p-8 text-center text-xs text-slate-400">Loading templates...</div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {templates.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`w-full flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                          selectedTemplateId === tpl.id
                            ? "border-blue-900 bg-blue-50/50 shadow-xs ring-1 ring-blue-900"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                tpl.category === "Marketing"
                                  ? "bg-purple-100 text-purple-900"
                                  : "bg-sky-100 text-sky-900"
                              }`}
                            >
                              {tpl.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tpl.body}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex-shrink-0">
                          {tpl.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Template Preview Card */}
              {selectedTemplate && (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Template Live Preview
                  </div>
                  {selectedTemplate.headerText && (
                    <p className="text-xs font-bold text-slate-900 mb-1">{selectedTemplate.headerText}</p>
                  )}
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">{selectedTemplate.body}</p>
                  {selectedTemplate.footer && (
                    <p className="text-[10px] text-slate-400 mt-1">{selectedTemplate.footer}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: RECIPIENT VALIDATION */}
          {step === 3 && validationResult && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900">Audience Validation Results</h4>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-emerald-700 font-semibold">Valid Recipients</span>
                  <p className="text-2xl font-bold text-emerald-900 font-mono mt-0.5">
                    {validationResult.validRecipients.length}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-amber-700 font-semibold">Excluded</span>
                  <p className="text-2xl font-bold text-amber-900 font-mono mt-0.5">
                    {validationResult.excludedRecipients.length}
                  </p>
                </div>
              </div>

              {/* Exclusions Details */}
              {validationResult.excludedRecipients.length > 0 && (
                <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1.5">
                  <div className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                    Exclusion Reasons:
                  </div>
                  {validationResult.excludedRecipients.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex justify-between text-slate-600">
                      <span>{ex.name} ({ex.phone || "No phone"}):</span>
                      <span className="text-amber-800 font-medium">{ex.reason}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-500">
                Messages will only be sent to valid, active WhatsApp numbers with E.164 country code compliance.
              </p>
            </div>
          )}

          {/* STEP 4: COST BREAKDOWN */}
          {step === 4 && validationResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-900" />
                <h4 className="text-xs font-bold text-slate-900">Estimated WhatsApp Messaging Cost</h4>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Template Category:</span>
                  <span className="font-bold text-slate-900">{validationResult.template?.category || "Marketing"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Valid Recipients:</span>
                  <span className="font-mono font-bold text-slate-900">{validationResult.validRecipients.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Configured Rate per Message:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{validationResult.ratePerMessage.toFixed(2)} {validationResult.currency}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-900">Total Estimated Cost:</span>
                  <span className="text-blue-900 font-mono text-base">
                    ₹{validationResult.estimatedCost.toFixed(2)} {validationResult.currency}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
                <p className="font-semibold">Transparent WhatsApp Direct Billing</p>
                <p className="text-[11px] text-blue-800 leading-snug">
                  WhatsApp messaging fees are billed directly via your Meta Business Account and configured provider pricing. This is distinct from AI inference credits.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SEND */}
          {step === 5 && validationResult && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900">Review & Confirm Campaign</h4>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Campaign:</span>
                  <span className="font-bold text-slate-900">{campaignName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Template:</span>
                  <span className="font-semibold text-slate-800">{validationResult.template?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipients:</span>
                  <span className="font-mono font-bold text-emerald-700">{validationResult.validRecipients.length} Prospects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <span className="font-mono font-bold text-slate-900">₹{validationResult.estimatedCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">Confirmation Required</p>
                <p className="text-[11px] text-amber-800">
                  Clicking &ldquo;Confirm &amp; Send Campaign&rdquo; will dispatch template messages via Meta WhatsApp Cloud API to all {validationResult.validRecipients.length} validated recipients.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: RESULT */}
          {step === 6 && sendResult && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Campaign Dispatched Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Campaign &ldquo;{sendResult.name}&rdquo; has been processed.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 max-w-sm mx-auto">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Sent</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{sendResult.sentCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block">Delivered</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">{sendResult.deliveredCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] text-blue-700 block">Read</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">{sendResult.readCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          {step > 1 && step < 6 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 6 && (
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
            )}

            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Select Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleValidate}
                disabled={isValidating || !selectedTemplateId}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <span>Validate Audience</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}

            {step === 3 && (
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Review Cost</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={() => setStep(5)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Proceed to Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 5 && (
              <button
                onClick={handleDispatch}
                disabled={isSending}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Campaign...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Send Campaign</span>
                  </>
                )}
              </button>
            )}

            {step === 6 && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors shadow-xs"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
