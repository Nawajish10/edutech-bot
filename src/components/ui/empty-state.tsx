import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No records found",
  description = "There is currently no data to display for this tenant or filter criteria.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-slate-200 rounded-xl space-y-4">
      <div className="p-3 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
        {icon || <FolderOpen className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
