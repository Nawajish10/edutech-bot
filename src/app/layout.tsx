import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TenantProvider } from "@/lib/tenant-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI WhatsApp Platform | Multi-Tenant SaaS",
  description:
    "Production-ready multi-tenant SaaS application for AI-powered WhatsApp conversations, lead qualification, and customer management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50 text-slate-900 antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        <TenantProvider>{children}</TenantProvider>
      </body>
    </html>
  );
}
