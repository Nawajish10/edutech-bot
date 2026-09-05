"use client";

import React, { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { X } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex flex-col w-64 max-w-xs bg-white shadow-2xl z-50">
        <button
          onClick={onClose}
          className="absolute right-3 top-3.5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 z-50"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>

        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}
