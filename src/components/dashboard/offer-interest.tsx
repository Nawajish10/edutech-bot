"use client";

import React from "react";
import Link from "next/link";

interface TopOfferInterest {
  offerName: string;
  inquiries: number;
  conversionRate?: string;
}

interface OfferInterestProps {
  data: TopOfferInterest[];
}

export function OfferInterest({ data }: OfferInterestProps) {
  const defaultCourses: TopOfferInterest[] = [
    { offerName: "Digital Marketing Career", inquiries: 42 },
    { offerName: "Performance Marketing Specialist", inquiries: 31 },
    { offerName: "Digital Marketing Professional", inquiries: 27 },
    { offerName: "E-Commerce Growth Specialist", inquiries: 19 },
    { offerName: "SEO & GEO Specialist", inquiries: 16 },
  ];

  const list = data && data.length > 0 ? data.slice(0, 5) : defaultCourses;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Top Courses by Interest</h3>
          <Link
            href="/courses"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <span>&gt;</span>
          </Link>
        </div>

        <div className="space-y-2.5">
          {list.map((item, idx) => (
            <div
              key={item.offerName}
              className="flex items-center justify-between gap-3 text-xs py-1"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-slate-400 font-semibold font-mono text-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 truncate" title={item.offerName}>
                  {item.offerName}
                </span>
              </div>
              <span className="text-slate-500 font-medium whitespace-nowrap">
                <strong className="text-slate-900 font-mono">{item.inquiries}</strong> leads
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
