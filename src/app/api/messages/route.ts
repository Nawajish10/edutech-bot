import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getMessages, getConversations } from "@/lib/server/db";
import { sendWhatsAppMessage } from "@/lib/server/whatsapp";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const requestedTenant = searchParams.get("tenantId");

  const tenantId =
    user.role === "platform_admin" && requestedTenant
      ? requestedTenant
      : user.tenant_id;

  if (!tenantId || !conversationId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const messages = await getMessages(conversationId, tenantId);
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const user = cookie?.value ? await verifySessionToken(cookie.value) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { conversationId, messageText, requestedTenant } = body;

    const tenantId =
      user.role === "platform_admin" && requestedTenant
        ? requestedTenant
        : user.tenant_id;

    if (!tenantId || !conversationId || !messageText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conversations = await getConversations(tenantId);
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const result = await sendWhatsAppMessage({
      tenantId,
      conversationId,
      recipientWaId: conversation.contactPhone,
      messageText,
      senderType: "agent",
      senderName: user.name,
    });

    const messages = await getMessages(conversationId, tenantId);

    return NextResponse.json({
      success: true,
      result,
      messages,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to dispatch message", details: String(err) },
      { status: 500 }
    );
  }
}
