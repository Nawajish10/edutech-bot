import React from "react";
// Superadmin platform users view

export default function PlatformUsersPage() {
  const users = [
    {
      id: "usr-1",
      email: "superadmin@platform.internal",
      name: "Platform Superadmin",
      role: "Platform Admin",
      organizations: "Global (All)",
      status: "Active",
    },
    {
      id: "usr-2",
      email: "alok@aakasaskillsacademy.com",
      name: "Dr. Alok Verma",
      role: "Owner",
      organizations: "Aakasa Skills Academy",
      status: "Active",
    },
    {
      id: "usr-3",
      email: "vikram@apexfitness.example.com",
      name: "Vikram Singhania",
      role: "Owner",
      organizations: "Apex Fitness & Performance",
      status: "Active",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Users & Memberships</h1>
          <p className="text-xs text-slate-400 mt-1">
            Users registered across all organizations with tenant membership roles.
          </p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Platform Role</th>
                <th className="px-5 py-3.5">Assigned Tenant Scope</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-850">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white">{u.name}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-medium">{u.organizations}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-emerald-400 font-semibold">{u.status}</span>
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
