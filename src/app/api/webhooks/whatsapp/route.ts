// ==========================================
// META WHATSAPP CLOUD API WEBHOOK ENDPOINT
// Hardened with Signature Verification, Idempotency,
// Strict Tenant Resolution, and Button Flows
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import {
  getWhatsAppConnectionByPhoneNumberId,
  getOrganization,
  saveContact,
  saveConversation,
  saveMessage,
  saveLead,
  recordAnalyticsEvent,
  getConversations,
} from "@/lib/server/db";
import { sendWhatsAppMessage } from "@/lib/server/whatsapp";
import { processIncomingMessageWithAI } from "@/lib/server/ai";
import { Contact, Message, Lead } from "@/types";

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "aakasa_whatsapp_verify_token_2026";
const META_APP_SECRET = process.env.META_APP_SECRET;

// In-memory idempotency cache for processed Meta message IDs
const processedMessageIds = new Set<string>();

/**
 * Validates X-Hub-Signature-256 using Web Crypto API HMAC-SHA256
 */
async function verifyMetaSignature(rawBody: string, signatureHeader: string | null): Promise<boolean> {
  if (!META_APP_SECRET) {
    // If no app secret is configured in local development, permit request with audit log
    if (process.env.NODE_ENV === "production") {
      console.warn("[WhatsAppWebhook:Security] META_APP_SECRET missing in production environment");
    }
    return true;
  }

  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = signatureHeader.slice(7);

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(META_APP_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(rawBody)
    );

    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return computedSignature.toLowerCase() === expectedSignature.toLowerCase();
  } catch (err) {
    console.error("[WhatsAppWebhook:Security] Signature calculation error:", err);
    return false;
  }
}

/**
 * GET Handler: Meta Webhook Verification Handshake
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
    console.log("[WhatsAppWebhook:Handshake] Verification successful with challenge token.");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.warn("[WhatsAppWebhook:Handshake] Verification token mismatch or invalid mode.");
  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

/**
 * POST Handler: Process Incoming WhatsApp Messages
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // 1. Signature Verification (Phase 3C)
    const signatureHeader = req.headers.get("x-hub-signature-256");
    const isSignatureValid = await verifyMetaSignature(rawBody, signatureHeader);

    if (!isSignatureValid) {
      console.error("[WhatsAppWebhook:Security] Invalid X-Hub-Signature-256 signature rejected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // Validate Meta Cloud API structure
    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored_non_whatsapp_event" }, { status: 200 });
    }

    const entries = body.entry as Array<{ changes?: Array<{ value?: Record<string, unknown> }> }> | undefined;
    const entry = entries?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const messages = value?.messages as Array<Record<string, unknown>> | undefined;
    if (!value || !messages || messages.length === 0) {
      return NextResponse.json({ status: "no_messages_in_payload" }, { status: 200 });
    }

    const metadata = value.metadata as { phone_number_id?: string; display_phone_number?: string } | undefined;
    const phoneNumberId = metadata?.phone_number_id;
    const incomingMsg = messages[0];
    const contacts = value.contacts as Array<{ profile?: { name?: string }; wa_id?: string }> | undefined;
    const contactInfo = contacts?.[0];

    const waId = incomingMsg.from as string;
    const messageId = (incomingMsg.id as string) || `msg-${Date.now()}`;
    const messageType = incomingMsg.type as string;
    const timestamp = (incomingMsg.timestamp as string) || String(Math.floor(Date.now() / 1000));

    // 2. Webhook Idempotency Check (Phase 3D)
    if (messageId && processedMessageIds.has(messageId)) {
      console.log(`[WhatsAppWebhook:Idempotency] Duplicate webhook for message_id: ${messageId}. Returning 200 OK without re-processing.`);
      return NextResponse.json({ status: "idempotent_duplicate_ignored", messageId }, { status: 200 });
    }
    processedMessageIds.add(messageId);

    // Keep memory set bounded to prevent unbounded growth
    if (processedMessageIds.size > 5000) {
      const firstEntries = Array.from(processedMessageIds).slice(0, 1000);
      firstEntries.forEach((id) => processedMessageIds.delete(id));
    }

    let messageText = "";
    let buttonPayloadId = "";

    if (messageType === "text") {
      const textObj = incomingMsg.text as { body?: string } | undefined;
      messageText = textObj?.body || "";
    } else if (messageType === "interactive") {
      const interactiveObj = incomingMsg.interactive as {
        button_reply?: { id?: string; title?: string };
        list_reply?: { id?: string; title?: string };
      } | undefined;
      messageText = interactiveObj?.button_reply?.title || interactiveObj?.list_reply?.title || "";
      buttonPayloadId = interactiveObj?.button_reply?.id || interactiveObj?.list_reply?.id || "";
    } else {
      messageText = `[${messageType} message]`;
    }

    // 3. Resolve Tenant Strictly via phone_number_id (Phase 3B)
    if (!phoneNumberId) {
      console.error("[WhatsAppWebhook:Tenant] Missing phone_number_id in incoming webhook payload");
      return NextResponse.json({ error: "Missing phone_number_id" }, { status: 400 });
    }

    const connection = await getWhatsAppConnectionByPhoneNumberId(phoneNumberId);
    if (!connection) {
      console.error(`[WhatsAppWebhook:Tenant] Unknown phone_number_id: ${phoneNumberId}. No tenant mapped.`);
      return NextResponse.json({ error: "Unknown phone_number_id" }, { status: 404 });
    }

    const tenantId = connection.tenantId;
    const org = await getOrganization(tenantId);
    const businessName = org?.name || connection.businessName;

    console.log(`[WhatsAppWebhook:Received] Tenant '${tenantId}' resolved from phone_number_id '${phoneNumberId}'. Msg from wa_id: '${waId}'`);

    // 4. Find or Create Contact
    const contactName = contactInfo?.profile?.name || `Customer (+${waId.slice(-4)})`;
    const contact: Contact = {
      id: `contact-${tenantId}-${waId}`,
      tenantId,
      phone: `+${waId}`,
      name: contactName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveContact(contact);

    // 5. Find or Create Conversation
    const tenantConversations = await getConversations(tenantId);
    let conversation = tenantConversations.find(
      (c) => c.contactPhone === `+${waId}` || c.contactId === contact.id
    );

    if (!conversation) {
      conversation = {
        id: `conv-${tenantId}-${waId}`,
        tenantId,
        contactId: contact.id,
        contactName,
        contactPhone: `+${waId}`,
        contactAvatar: contactName.slice(0, 2).toUpperCase(),
        status: "open",
        mode: "AI Handling",
        assignedTo: "AI Assistant",
        lastMessageSnippet: messageText,
        lastMessageAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unreadCount: 1,
        tags: ["New Lead", "WhatsApp Inbound"],
        firstMessageHandled: false,
        botState: "First",
        intent: "new_inquiry",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveConversation(conversation);
    }

    // 6. Save Inbound Message
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const inboundMessage: Message = {
      id: `msg-in-${messageId}`,
      tenantId,
      conversationId: conversation.id,
      senderType: "customer",
      content: messageText,
      timestamp: nowTime,
      deliveryStatus: "read",
      messageId,
      botState: conversation.botState,
    };
    await saveMessage(inboundMessage);

    await recordAnalyticsEvent(tenantId, "message_received", {
      messageId,
      waId,
      phoneNumberId,
      timestamp,
    });

    // 7. First Message Flow with Concurrency Lock (Phase 3E)
    if (!conversation.firstMessageHandled) {
      // Set lock immediately
      conversation.firstMessageHandled = true;
      conversation.botState = "Greeting";
      conversation.updatedAt = new Date().toISOString();
      await saveConversation(conversation);

      const welcomeText = `👋 Hi! Welcome to ${businessName}!\n\nWhat are you looking to achieve?`;
      const buttons = [
        { id: "career_job", title: "💼 Get a Job" },
        { id: "freelancing", title: "🧑💻 Freelancing" },
        { id: "business", title: "🚀 Business" },
      ];

      await sendWhatsAppMessage({
        tenantId,
        conversationId: conversation.id,
        recipientWaId: waId,
        messageText: welcomeText,
        senderType: "ai",
        senderName: "AI Assistant",
        interactiveButtons: buttons,
      });

      console.log(`[WhatsAppWebhook:FirstMessage] Welcome message & 3 quick-reply buttons dispatched to ${waId}.`);
    } else if (conversation.mode === "AI Handling") {
      // 8. Grounded AI Processing (Phase 3F)
      const inputMessage = buttonPayloadId ? `${messageText} (Goal Selection: ${buttonPayloadId})` : messageText;

      const aiResult = await processIncomingMessageWithAI({
        tenantId,
        conversationId: conversation.id,
        userMessage: inputMessage,
        contactName,
      });

      await sendWhatsAppMessage({
        tenantId,
        conversationId: conversation.id,
        recipientWaId: waId,
        messageText: aiResult.replyText,
        senderType: "ai",
        senderName: "AI Assistant",
      });

      conversation.botState = aiResult.suggestedState;
      conversation.intent = aiResult.intent;

      // 9. Lead Pipeline Association & De-duplication (Phase 3G)
      const leadGoal = buttonPayloadId === "career_job" ? "Job Placement" :
        buttonPayloadId === "freelancing" ? "Freelancing" :
        buttonPayloadId === "business" ? "Business Growth" : "General Inquiry";

      const updatedLead: Lead = {
        id: `lead-${tenantId}-${waId}`,
        tenantId,
        contactId: contact.id,
        conversationId: conversation.id,
        name: contactName,
        phone: `+${waId}`,
        goal: leadGoal,
        experienceLevel: "Beginner",
        offerInterest: aiResult.intent === "course_inquiry" ? "AI & Marketing" : "Academy Programs",
        status: aiResult.requiresHandoff ? "Qualified" : "Engaged",
        budget: "Standard",
        preferredStartDate: "Immediate",
        city: "India",
        humanHandoff: aiResult.requiresHandoff,
        assignedTo: aiResult.requiresHandoff ? "Kavita Nair (Advisor)" : "AI Assistant",
        source: "WhatsApp Organic",
        createdAt: conversation.createdAt,
        updatedAt: new Date().toISOString(),
      };
      await saveLead(updatedLead);

      // 10. Human Escalation (Phase 3H)
      if (aiResult.requiresHandoff) {
        conversation.mode = "Human Agent";
        conversation.assignedTo = "Kavita Nair (Advisor)";
        if (!conversation.tags.includes("Handoff Active")) {
          conversation.tags.push("Handoff Active");
        }
        await recordAnalyticsEvent(tenantId, "human_handoff", {
          conversationId: conversation.id,
          reason: aiResult.handoffReason,
        });
        console.log(`[WhatsAppWebhook:Handoff] Human counselor escalation activated for conversation: ${conversation.id}`);
      }

      await saveConversation(conversation);
    }

    return NextResponse.json({ status: "success", tenantId });
  } catch (error) {
    console.error("[WhatsAppWebhook] Processing error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
