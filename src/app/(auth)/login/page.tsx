"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    if (!loginEmail || !loginPassword) {
      setError("Please provide email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setLoading(false);
    }
  };

  const handleQuickLogin = (emailVal: string) => {
    setEmail(emailVal);
    setPassword("password123");
    handleLogin(undefined, emailVal, "password123");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-blue-900 text-white rounded-xl mx-auto flex items-center justify-center text-xl font-bold shadow-md shadow-blue-950/20">
            W
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AI WhatsApp Platform
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your tenant workspace
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@aakasa.com"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-slate-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Pre-Seeded Quick Login Demo Buttons */}
        <div className="pt-5 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>One-Click Test Accounts</span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@aakasa.com")}
              className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-blue-900 hover:bg-blue-50/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-blue-900">
                  🎓 Aakasa Skills Academy (Admin)
                </span>
                <span className="text-[11px] text-slate-500">
                  admin@aakasa.com • tenant_admin
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("kavita@aakasa.com")}
              className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-blue-900 hover:bg-blue-50/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-blue-900">
                  👩‍💼 Aakasa Skills Academy (Agent)
                </span>
                <span className="text-[11px] text-slate-500">
                  kavita@aakasa.com • agent (counsellor)
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin@apexfitness.com")}
              className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-blue-900 hover:bg-blue-50/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-blue-900">
                  💪 Apex Fitness & Performance (Admin)
                </span>
                <span className="text-[11px] text-slate-500">
                  admin@apexfitness.com • tenant_admin
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("superadmin@platform.com")}
              className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-blue-900 hover:bg-blue-50/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-blue-900">
                  🌐 Platform Superadmin
                </span>
                <span className="text-[11px] text-slate-500">
                  superadmin@platform.com • platform_admin
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900" />
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tenant data isolation enforced by server session</span>
        </div>
      </div>
    </div>
  );
}
