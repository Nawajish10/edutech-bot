import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getOffers, updateCourse } from "@/lib/server/db";

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
      : user.tenant_id || "tenant-aakasa";

  const courses = await getOffers(tenantId);
  return NextResponse.json({ courses });
}

export async function PATCH(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user || user.role === "agent") {
    return NextResponse.json({ error: "Unauthorized. Admin role required to edit courses." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { courseId, data, requestedTenant } = body;

    const tenantId =
      user.role === "platform_admin" && requestedTenant
        ? requestedTenant
        : user.tenant_id || "tenant-aakasa";

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const updated = await updateCourse(tenantId, courseId, data);
    if (!updated) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, course: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update course", details: String(err) }, { status: 500 });
  }
}
