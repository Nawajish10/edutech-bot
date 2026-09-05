import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { executeCampaignSend } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user || user.role === "agent") {
    return NextResponse.json({ error: "Unauthorized. Admin role required to send campaigns." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, templateId, leadIds, requestedTenant } = body;

    const tenantId =
      user.role === "platform_admin" && requestedTenant
        ? requestedTenant
        : user.tenant_id || "tenant-aakasa";

    if (!name || !templateId) {
      return NextResponse.json({ error: "Campaign name and template ID are required" }, { status: 400 });
    }

    const result = await executeCampaignSend(tenantId, {
      name,
      templateId,
      leadIds: leadIds || [],
      createdBy: user.name,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Campaign dispatch failed", details: String(err) }, { status: 500 });
  }
}
