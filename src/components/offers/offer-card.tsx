import React from "react";
import { Offer } from "@/types";
import { ExternalLink, Users, TrendingUp, Sparkles, CheckCircle2, Clock } from "lucide-react";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
      <div>
        {/* Category & Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-100">
            {offer.category}
          </span>
          <div className="flex items-center gap-1.5">
            {offer.duration && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                <Clock className="w-3 h-3 text-blue-900" />
                {offer.duration}
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
              {offer.status}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">
          {offer.title}
        </h3>

        {/* Positioning / Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {offer.description}
        </p>

        {/* Best For Tag */}
        {offer.bestFor && (
          <div className="mb-3 p-2 bg-slate-50/70 rounded-lg border border-slate-100 text-[11px]">
            <span className="text-slate-400 font-bold uppercase text-[9px] block">Target Audience</span>
            <p className="text-slate-700 font-medium line-clamp-1">{offer.bestFor}</p>
          </div>
        )}

        {/* Core Topics Checklist */}
        {offer.coreTopics && offer.coreTopics.length > 0 && (
          <div className="mb-4 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[9px] block">Curriculum Highlights</span>
            <div className="space-y-1">
              {offer.coreTopics.slice(0, 3).map((topic, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{topic}</span>
                </div>
              ))}
              {offer.coreTopics.length > 3 && (
                <p className="text-[10px] text-slate-400 font-medium pl-4.5">
                  +{offer.coreTopics.length - 3} more practical modules
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
        {/* Pricing Box with Launch Discount */}
        <div className="flex items-baseline justify-between bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-blue-950 font-mono">
                {offer.displayedOfferPrice}
              </span>
              {offer.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {offer.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="w-2.5 h-2.5" />
              Launch Price
            </span>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="flex items-center justify-between text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-900" />
            <strong className="text-slate-800">{offer.inquiryCount}</strong> inquiries
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <strong className="text-slate-800">{offer.conversionCount}</strong> enrolled
          </span>
        </div>

        {/* Verified Link */}
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:text-blue-900 hover:border-blue-900 text-xs font-semibold hover:bg-blue-50/30 transition-colors"
        >
          <span>View Verified Program Page</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
