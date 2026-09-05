import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { searchAll } from "@/lib/server/db";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const requestedTenant = searchParams.get("tenantId");

  const tenantId =
    user.role === "platform_admin" && requestedTenant
      ? requestedTenant
      : user.tenant_id || "tenant-aakasa";

  const results = await searchAll(tenantId, query);
  return NextResponse.json({ results });
}
