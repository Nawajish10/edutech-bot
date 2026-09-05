import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { verifyOtpRequest } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user || user.role === "agent") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { phoneNumber, code, requestedTenant } = body;

    const tenantId =
      user.role === "platform_admin" && requestedTenant
        ? requestedTenant
        : user.tenant_id || "tenant-aakasa";

    if (!phoneNumber || !code) {
      return NextResponse.json({ error: "Phone number and 6-digit OTP code are required" }, { status: 400 });
    }

    const result = await verifyOtpRequest(tenantId, phoneNumber, code);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "WhatsApp connection successfully verified and connected." });
  } catch (err) {
    return NextResponse.json({ error: "Verification failed", details: String(err) }, { status: 500 });
  }
}
