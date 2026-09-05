import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { runAllTenantQueriesDiagnostic } from "@/lib/server/db";
import { validateGoogleSheetsConnection } from "@/lib/server/sheets";

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

  const isProduction = process.env.NODE_ENV === "production";

  // 1. Audit Google Sheets Dependency
  const sheetsAudit = await validateGoogleSheetsConnection();
  const googleSheetsStatus:
    | "LIVE"
    | "MOCK/FALLBACK"
    | "BLOCKED"
    | "AUTH_FAILED"
    | "API_ERROR" =
    sheetsAudit.status === "LIVE"
      ? "LIVE"
      : sheetsAudit.status === "AUTH_FAILED"
      ? "AUTH_FAILED"
      : sheetsAudit.status === "API_ERROR"
      ? "API_ERROR"
      : isProduction
      ? "BLOCKED"
      : "MOCK/FALLBACK";

  // 2. Audit Meta WhatsApp Dependency
  const hasMetaAppId = Boolean(process.env.META_APP_ID && !process.env.META_APP_ID.includes("placeholder"));
  const hasMetaAppSecret = Boolean(process.env.META_APP_SECRET && !process.env.META_APP_SECRET.includes("placeholder"));
  const hasMetaAccessToken = Boolean(process.env.META_ACCESS_TOKEN && !process.env.META_ACCESS_TOKEN.includes("placeholder"));
  const hasMetaVerifyToken = Boolean(process.env.META_VERIFY_TOKEN);

  const metaWhatsAppStatus: "LIVE" | "MOCK/FALLBACK" | "BLOCKED" =
    hasMetaAccessToken && hasMetaAppId
      ? "LIVE"
      : isProduction
      ? "BLOCKED"
      : "MOCK/FALLBACK";

  // 3. Audit AI Provider Dependency
  const openAiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const hasLiveAiKey = Boolean(
    (openAiKey && !openAiKey.includes("placeholder")) ||
    (anthropicKey && !anthropicKey.includes("placeholder")) ||
    (openRouterKey && !openRouterKey.includes("placeholder"))
  );

  const aiProviderStatus: "LIVE" | "MOCK/FALLBACK" | "BLOCKED" =
    hasLiveAiKey
      ? "LIVE"
      : isProduction
      ? "BLOCKED"
      : "MOCK/FALLBACK";

  // 4. Audit n8n Workflow Dependency
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  const hasLiveN8n = Boolean(n8nWebhookUrl && !n8nWebhookUrl.includes("placeholder"));
  const n8nStatus: "LIVE" | "MOCK/FALLBACK" | "BLOCKED" = hasLiveN8n
    ? "LIVE"
    : "BLOCKED";

  // 5. Run all 10 DAL queries
  const dalAudit = await runAllTenantQueriesDiagnostic(tenantId);

  return NextResponse.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    user: {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
    },
    dependencies: {
      googleSheets: {
        status: googleSheetsStatus,
        mode: sheetsAudit.mode,
        spreadsheetId: sheetsAudit.spreadsheetId,
        spreadsheetTitle: sheetsAudit.spreadsheetTitle,
        configuredTabs: sheetsAudit.configuredTabs,
        message: sheetsAudit.message,
      },
      metaWhatsApp: {
        status: metaWhatsAppStatus,
        hasAppId: hasMetaAppId,
        hasAppSecret: hasMetaAppSecret,
        hasAccessToken: hasMetaAccessToken,
        hasVerifyToken: hasMetaVerifyToken,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/whatsapp`,
        message:
          metaWhatsAppStatus === "LIVE"
            ? "Meta WhatsApp Cloud API credentials configured."
            : metaWhatsAppStatus === "BLOCKED"
            ? "Meta WhatsApp Cloud API credentials missing in production."
            : "Running with local simulator for outbound dispatch and webhook parser (development only).",
      },
      aiProvider: {
        status: aiProviderStatus,
        hasLiveKey: hasLiveAiKey,
        defaultModel: "gpt-4o-mini",
        message:
          aiProviderStatus === "LIVE"
            ? "Live LLM API key configured (OpenAI)."
            : aiProviderStatus === "BLOCKED"
            ? "AI API key missing in production."
            : "Running with deterministic rule engine grounded in tenant Knowledge Base.",
      },
      n8n: {
        status: n8nStatus,
        hasWebhookUrl: hasLiveN8n,
        webhookUrl: n8nWebhookUrl || "Not Configured",
        message:
          n8nStatus === "LIVE"
            ? "n8n workflow webhook endpoint active."
            : "n8n is not connected to a live workflow instance in this environment.",
      },
    },
    dataAccessLayer: dalAudit,
  });
}
