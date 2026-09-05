"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";
import { ChevronsUpDown, Check, Building2, Lock } from "lucide-react";

export function TenantSwitcher() {
  const { tenant, availableTenants, setTenantId, isPlatformAdmin, currentUser } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // For tenant_admin and agent: lock to their assigned tenant
  if (!isPlatformAdmin) {
    return (
      <div className="w-full flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 text-left shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center text-base font-semibold shadow-xs">
            {tenant.logo || <Building2 className="w-4 h-4" />}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {tenant.name}
            </p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              {tenant.businessType} • {currentUser?.role || "Member"}
            </p>
          </div>
        </div>
        <div title="Tenant determined by authenticated user session">
          <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </div>
      </div>
    );
  }

  // For platform_admin: allow interactive organization switching
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left shadow-xs group"
        title="Superadmin: Switch organization scope"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center text-base font-semibold shadow-xs">
            {tenant.logo || <Building2 className="w-4 h-4" />}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-900 transition-colors">
                {tenant.name}
              </p>
              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              {tenant.businessType} • {tenant.offerType}
            </p>
          </div>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 max-h-72 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Superadmin: Switch Active Tenant
          </div>
          {availableTenants.map((org) => {
            const isSelected = org.id === tenant.id;
            return (
              <button
                key={org.id}
                onClick={() => {
                  setTenantId(org.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isSelected
                    ? "bg-blue-50/80 text-blue-900 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">
                    {org.logo}
                  </span>
                  <div className="text-left min-w-0">
                    <p className="truncate">{org.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">
                      {org.businessType} ({org.offerType})
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
