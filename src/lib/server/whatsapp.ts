// ==========================================
// REUSABLE SERVER-SIDE WHATSAPP CLOUD API SERVICE
// ==========================================

import { getWhatsAppConnection, saveMessage, recordAnalyticsEvent } from "@/lib/server/db";
import { Message } from "@/types";

export interface InteractiveButtonOption {
  id: string;
  title: string;
}

export interface SendWhatsAppMessageParams {
  tenantId: string;
  conversationId: string;
  recipientWaId: string;
  messageText: string;
  senderType?: "ai" | "agent" | "system";
  senderName?: string;
  interactiveButtons?: InteractiveButtonOption[];
}

export interface SendWhatsAppResult {
  success: boolean;
  messageId: string;
  mode: "meta_cloud_api" | "local_simulation";
  error?: string;
}

export async function sendWhatsAppMessage({
  tenantId,
  conversationId,
  recipientWaId,
  messageText,
  senderType = "agent",
  senderName = "Human Advisor",
  interactiveButtons,
}: SendWhatsAppMessageParams): Promise<SendWhatsAppResult> {
  // 1. Resolve tenant's WhatsApp connection & phone_number_id
  const connection = await getWhatsAppConnection(tenantId);
  if (!connection) {
    throw new Error(`No WhatsApp connection configured for tenant: ${tenantId}`);
  }

  const phoneNumberId = connection.phoneNumberId;
  const metaToken = process.env.META_ACCESS_TOKEN;

  let outWamid = `wamid.HBgM${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}A`;
  let mode: "meta_cloud_api" | "local_simulation" = "local_simulation";

  // 2. Call Meta WhatsApp Cloud API if access token exists
  if (metaToken && connection.connectionStatus === "Connected") {
    try {
      const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

      let payload: Record<string, unknown>;

      if (interactiveButtons && interactiveButtons.length > 0) {
        payload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipientWaId.replace(/[^0-9]/g, ""),
          type: "interactive",
          interactive: {
            type: "button",
            body: { text: messageText },
            action: {
              buttons: interactiveButtons.slice(0, 3).map((btn) => ({
                type: "reply",
                reply: { id: btn.id, title: btn.title },
              })),
            },
          },
        };
      } else {
        payload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipientWaId.replace(/[^0-9]/g, ""),
          type: "text",
          text: { body: messageText },
        };
      }

      const metaRes = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${metaToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const metaData = await metaRes.json();
      if (metaRes.ok && metaData.messages?.[0]?.id) {
        outWamid = metaData.messages[0].id;
        mode = "meta_cloud_api";
      } else {
        console.warn("[WhatsAppService] Meta API responded with error, falling back to local audit:", metaData);
      }
    } catch (err) {
      console.error("[WhatsAppService] Failed to dispatch via Meta API:", err);
    }
  }

  // 3. Save outbound message in conversation thread
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const outboundMessage: Message = {
    id: `msg-out-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tenantId,
    conversationId,
    senderType,
    senderName,
    content: messageText,
    timestamp: timeFormatted,
    deliveryStatus: "sent",
    messageId: outWamid,
  };

  await saveMessage(outboundMessage);

  // 4. Record analytics event
  await recordAnalyticsEvent(tenantId, "ai_response", {
    conversationId,
    recipientWaId,
    mode,
    senderType,
  });

  return {
    success: true,
    messageId: outWamid,
    mode,
  };
}
