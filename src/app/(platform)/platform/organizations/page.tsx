import React from "react";
import { MOCK_ORGANIZATIONS } from "@/data/mock-organizations";
import { Plus, ExternalLink, ShieldCheck } from "lucide-react";

export default function PlatformOrganizationsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tenants & Organizations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Global directory of all client organizations provisioned on this platform deployment.
          </p>
        </div>

        <button
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision New Tenant</span>
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Organization</th>
                <th className="px-5 py-3.5">Tenant ID</th>
                <th className="px-5 py-3.5">Business Model</th>
                <th className="px-5 py-3.5">Offer Terminology</th>
                <th className="px-5 py-3.5">Website</th>
                <th className="px-5 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-850">
              {MOCK_ORGANIZATIONS.map((org) => (
                <tr key={org.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{org.logo}</span>
                      <span>{org.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-amber-400 whitespace-nowrap">
                    {org.id}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-300">
                    {org.businessType}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-blue-400 font-semibold">
                    {org.offerType}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white inline-flex items-center gap-1"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {org.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
