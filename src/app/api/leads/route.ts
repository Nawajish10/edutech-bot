import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getLeads, saveLead } from "@/lib/server/db";
import { Lead } from "@/types";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedTenant = searchParams.get("tenantId");

  const tenantId =
    user.role === "platform_admin" && requestedTenant
      ? requestedTenant
      : user.tenant_id;

  if (!tenantId) {
    return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });
  }

  const leads = await getLeads(tenantId);
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const leadData: Lead = body;

    // Enforce tenant ID from session for non-superadmins
    if (user.role !== "platform_admin" && leadData.tenantId !== user.tenant_id) {
      leadData.tenantId = user.tenant_id!;
    }

    const saved = await saveLead(leadData);
    return NextResponse.json({ success: true, lead: saved });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save lead", details: String(err) }, { status: 500 });
  }
}
