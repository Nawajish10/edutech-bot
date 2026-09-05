"use client";

import React, { useState, useMemo } from "react";
import { useTenant } from "@/lib/tenant-context";
import { MOCK_TEAM_MEMBERS } from "@/data/mock-team";
import { TeamMember, UserRole, Organization } from "@/types";
import {
  UserPlus,
  Edit,
  UserX,
} from "lucide-react";

function TeamView({ tenant }: { tenant: Organization }) {
  const tenantMembers = useMemo(() => {
    const list = MOCK_TEAM_MEMBERS.filter((m) => m.tenantId === tenant.id);
    return list.length > 0 ? list : MOCK_TEAM_MEMBERS.filter((m) => m.tenantId === "tenant-aakasa");
  }, [tenant.id]);

  const [members, setMembers] = useState<TeamMember[]>(tenantMembers);

  const handleDeactivate = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m
      )
    );
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "Owner":
        return "bg-purple-50 text-purple-900 border-purple-200";
      case "Admin":
        return "bg-blue-50 text-blue-900 border-blue-200";
      case "Agent":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Team & Role Permissions</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {members.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage members, admissions counselors, and human advisors scoped to {tenant.name}.
          </p>
        </div>

        <button
          onClick={() => alert("Invite Team Member modal will connect to auth service in Phase 2.")}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Member Name</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Access Role</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Last Active</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {member.avatar || member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{member.name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-slate-600 font-mono text-[11px]">{member.email}</span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        member.status === "Active" ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          member.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {member.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                    {member.lastActive}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => alert(`Edit ${member.name} in Phase 2.`)}
                        className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit member"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(member.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title={member.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

export default function TeamPage() {
  const { tenant } = useTenant();
  return <TeamView key={tenant.id} tenant={tenant} />;
}
