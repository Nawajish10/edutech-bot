import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getWhatsAppConnection, updateWhatsAppConnection } from "@/lib/server/db";

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

  const connection = await getWhatsAppConnection(tenantId);
  const hasMetaCredentials = Boolean(process.env.META_ACCESS_TOKEN && process.env.META_APP_ID);

  if (!connection) {
    return NextResponse.json({
      connection: null,
      status: "Not Connected",
      hasMetaCredentials,
    });
  }

  // Never expose raw credentials or secret tokens
  const sanitized = {
    id: connection.id,
    tenantId: connection.tenantId,
    businessName: connection.businessName,
    displayPhoneNumber: connection.displayPhoneNumber,
    wabaId: connection.wabaId ? `${connection.wabaId.slice(0, 4)}...${connection.wabaId.slice(-4)}` : "Not Configured",
    phoneNumberId: connection.phoneNumberId ? `${connection.phoneNumberId.slice(0, 4)}...${connection.phoneNumberId.slice(-4)}` : "Not Configured",
    connectionStatus: hasMetaCredentials ? connection.connectionStatus : "Not Connected",
    webhookStatus: connection.webhookStatus,
    qualityRating: connection.qualityRating,
    aiAssistantEnabled: connection.aiAssistantEnabled,
    humanHandoffEnabled: connection.humanHandoffEnabled,
    lastSyncAt: connection.lastSyncAt,
  };

  return NextResponse.json({
    connection: sanitized,
    status: sanitized.connectionStatus,
    hasMetaCredentials,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/whatsapp`,
  });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user || user.role === "agent") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, requestedTenant } = body;

    const tenantId =
      user.role === "platform_admin" && requestedTenant
        ? requestedTenant
        : user.tenant_id;

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });
    }

    const hasMetaCredentials = Boolean(process.env.META_ACCESS_TOKEN && process.env.META_APP_ID);

    if (action === "test") {
      if (!hasMetaCredentials) {
        return NextResponse.json({
          success: false,
          error: "Meta WhatsApp Cloud API credentials (META_ACCESS_TOKEN, META_APP_ID) are not configured in .env.local. Connection test cannot reach Meta servers.",
          status: "Not Connected",
        });
      }

      // If credentials exist, execute ping to Meta Graph API
      try {
        const conn = await getWhatsAppConnection(tenantId);
        const pingRes = await fetch(
          `https://graph.facebook.com/v21.0/${conn?.phoneNumberId}?access_token=${process.env.META_ACCESS_TOKEN}`
        );
        const pingData = await pingRes.json();

        if (pingRes.ok) {
          await updateWhatsAppConnection(tenantId, { connectionStatus: "Connected" });
          return NextResponse.json({
            success: true,
            status: "Connected",
            verifiedPhone: pingData.display_phone_number || conn?.displayPhoneNumber,
          });
        } else {
          return NextResponse.json({
            success: false,
            error: pingData.error?.message || "Meta API responded with error",
            status: "Error",
          });
        }
      } catch (e) {
        return NextResponse.json({
          success: false,
          error: String(e),
          status: "Error",
        });
      }
    }

    if (action === "disconnect") {
      await updateWhatsAppConnection(tenantId, {
        connectionStatus: "Disconnected",
        webhookStatus: "Inactive",
      });
      return NextResponse.json({ success: true, status: "Disconnected" });
    }

    if (action === "connect") {
      if (!hasMetaCredentials) {
        return NextResponse.json({
          success: false,
          error: "Cannot connect: META_ACCESS_TOKEN and META_APP_ID must be set in your server environment before initiating live WhatsApp Cloud connection.",
          status: "Not Connected",
        });
      }

      await updateWhatsAppConnection(tenantId, {
        connectionStatus: "Connected",
        webhookStatus: "Active",
      });
      return NextResponse.json({ success: true, status: "Connected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Operation failed", details: String(err) }, { status: 500 });
  }
}
