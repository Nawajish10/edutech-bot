"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Search,
} from "lucide-react";

interface HistoryRecord {
  id: string;
  name: string;
  templateName: string;
  category: string;
  targetCount: number;
  validCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  estimatedCost: number;
  createdAt: string;
  createdBy: string;
  status: string;
}

export default function MessageHistoryPage() {
  const { tenant } = useTenant();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/messages/history?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.history) setHistory(data.history);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [tenant.id]);

  const filtered = history.filter(
    (h) =>
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.templateName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Message History &amp; Audit Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {history.length} Logs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full compliance audit log of broadcast outreach, recipient delivery receipts, timestamps, and Meta billing costs.
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Recipients</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Read</th>
                <th className="px-4 py-3">Failed</th>
                <th className="px-4 py-3">Cost (INR)</th>
                <th className="px-4 py-3">Created By</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400 text-xs">
                    No message history records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-blue-900">{item.templateName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.category === "Marketing"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{item.validCount}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{item.sentCount}</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-700">{item.deliveredCount}</td>
                    <td className="px-4 py-3 font-mono text-blue-700">{item.readCount}</td>
                    <td className="px-4 py-3 font-mono text-rose-600">{item.failedCount}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">₹{item.estimatedCost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-600">{item.createdBy}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
