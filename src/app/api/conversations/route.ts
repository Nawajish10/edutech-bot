import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getConversations } from "@/lib/server/db";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Determine tenant: either user's fixed tenant or query param for platform admin
  const { searchParams } = new URL(req.url);
  const requestedTenant = searchParams.get("tenantId");

  const tenantId =
    user.role === "platform_admin" && requestedTenant
      ? requestedTenant
      : user.tenant_id;

  if (!tenantId) {
    return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });
  }

  const conversations = await getConversations(tenantId);
  return NextResponse.json({ conversations });
}
