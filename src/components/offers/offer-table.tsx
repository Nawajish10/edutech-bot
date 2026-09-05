"use client";

import React from "react";
import { Offer } from "@/types";
import { useTenant } from "@/lib/tenant-context";
import { ExternalLink } from "lucide-react";

interface OfferTableProps {
  offers: Offer[];
}

export function OfferTable({ offers }: OfferTableProps) {
  const { getOfferLabel } = useTenant();
  const offerLabel = getOfferLabel(false);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">{offerLabel} Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Original</th>
              <th className="px-4 py-3">Offer Price</th>
              <th className="px-4 py-3">Best For</th>
              <th className="px-4 py-3">Inquiries</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Official Page</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <div className="font-bold text-slate-900 line-clamp-1">{offer.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{offer.description}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700">
                  {offer.category}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700">
                  {offer.duration}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-400 line-through font-mono">
                  {offer.originalPrice || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-bold text-blue-950 font-mono">
                    {offer.displayedOfferPrice}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-[180px]">
                  <p className="truncate text-[11px] text-slate-600" title={offer.bestFor}>
                    {offer.bestFor || "General"}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">
                  {offer.inquiryCount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {offer.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:text-blue-700"
                  >
                    <span>Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
