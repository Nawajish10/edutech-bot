import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { MOCK_ORGANIZATIONS } from "@/data/mock-organizations";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  if (!cookie || !cookie.value) {
    return NextResponse.json({ user: null, organization: null }, { status: 401 });
  }

  const user = await verifySessionToken(cookie.value);
  if (!user) {
    return NextResponse.json({ user: null, organization: null }, { status: 401 });
  }

  const organization = user.tenant_id
    ? MOCK_ORGANIZATIONS.find((o) => o.id === user.tenant_id) || MOCK_ORGANIZATIONS[0]
    : null; // Platform admin

  return NextResponse.json({
    user,
    organization,
  });
}
