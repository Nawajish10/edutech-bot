import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getTemplates, saveTemplate } from "@/lib/server/db";
import { WhatsAppTemplate } from "@/types";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedTenant = searchParams.get("tenantId");
  const category = searchParams.get("category") || undefined;

  const tenantId =
    user.role === "platform_admin" && requestedTenant
      ? requestedTenant
      : user.tenant_id || "tenant-aakasa";

  const templates = await getTemplates(tenantId, category);
  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user || user.role === "agent") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const tenantId =
      user.role === "platform_admin" && body.tenantId
        ? body.tenantId
        : user.tenant_id || "tenant-aakasa";

    const newTemplate: WhatsAppTemplate = {
      id: `tpl-${Date.now()}`,
      tenantId,
      name: body.name?.trim().toLowerCase().replace(/\s+/g, "_") || `template_${Date.now()}`,
      category: body.category || "Marketing",
      language: body.language || "en",
      status: "Submitted", // In production Meta API submission status
      headerType: body.headerType || "NONE",
      headerText: body.headerText,
      body: body.body || "",
      footer: body.footer,
      buttons: body.buttons || [],
      variables: body.variables || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveTemplate(newTemplate);
    return NextResponse.json({ success: true, template: saved });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create template", details: String(err) }, { status: 500 });
  }
}
