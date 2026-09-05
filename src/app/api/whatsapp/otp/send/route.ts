import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { createOtpRequest } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user || user.role === "agent") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { phoneNumber, method, requestedTenant } = body;

    const tenantId =
      user.role === "platform_admin" && requestedTenant
        ? requestedTenant
        : user.tenant_id || "tenant-aakasa";

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const result = await createOtpRequest(tenantId, phoneNumber, method === "voice" ? "voice" : "sms");
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Failed to send OTP", details: String(err) }, { status: 500 });
  }
}
