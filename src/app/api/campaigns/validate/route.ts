import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { validateCampaignAudience } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { leadIds, templateId, requestedTenant } = body;

    const tenantId =
      user.role === "platform_admin" && requestedTenant
        ? requestedTenant
        : user.tenant_id || "tenant-aakasa";

    if (!templateId) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
    }

    const validation = await validateCampaignAudience(tenantId, leadIds || [], templateId);
    return NextResponse.json({ success: true, ...validation });
  } catch (err) {
    return NextResponse.json({ error: "Audience validation failed", details: String(err) }, { status: 500 });
  }
}
