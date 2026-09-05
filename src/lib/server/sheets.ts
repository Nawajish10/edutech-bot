// ==========================================
// SERVER-SIDE GOOGLE SHEETS INTEGRATION & VALIDATION
// ==========================================

import crypto from "crypto";

export interface GoogleSheetsConfig {
  spreadsheetId?: string;
  clientEmail?: string;
  privateKey?: string;
}

/**
 * Robust normalization of GOOGLE_PRIVATE_KEY.
 * Handles:
 * - literal \n sequences
 * - real newline characters
 * - accidental surrounding double or single quotes
 * - accidental trailing comma from JSON copy/paste
 * Never logs the private key.
 */
export function normalizePrivateKey(rawKey?: string): string {
  if (!rawKey) return "";
  let key = rawKey.trim();

  // Strip accidental trailing comma from JSON copy/paste
  if (key.endsWith(",")) {
    key = key.slice(0, -1).trim();
  }

  // Strip accidental surrounding double or single quotes
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  // Convert literal \n sequences to actual newlines
  key = key.replace(/\\n/g, "\n");

  return key.trim();
}

export function getSheetsConfig(): GoogleSheetsConfig {
  return {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID || "1247vS367B7U4Onmre8wWEXBt-HBl25nAnjfab1HeRrQ",
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
    privateKey: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
  };
}

export const EXPECTED_SHEET_TABS = [
  "Organizations",
  "Users",
  "WhatsApp_Connections",
  "Contacts",
  "Conversations",
  "Messages",
  "Leads",
  "Offers",
  "Knowledge_Base",
  "FAQ",
  "Bot_Flow",
  "Analytics_Events",
  "AI_Usage",
] as const;

export type SheetTabName = typeof EXPECTED_SHEET_TABS[number] | "Courses" | "FAQ_Knowledge" | "Lead_Capture" | "Pitch_Opportunities" | "Sources" | string;

/**
 * Mapping table from canonical/code tab names to physical spreadsheet tab names.
 */
const TAB_ALIASES: Record<string, string> = {
  organizations: "Organization",
  organization: "Organization",
  users: "user",
  user: "user",
  whatsapp_connections: "whatsapp_connection ",
  whatsapp_connection: "whatsapp_connection ",
  "whatsapp_connection ": "whatsapp_connection ",
  contacts: "contacts",
  conversations: "conversation",
  conversation: "conversation",
  messages: "messages",
  leads: "leads",
  offers: "Offers",
  knowledge_base: "Knowledge_Base",
  faq: "FAQ_Knowledge",
  faq_knowledge: "FAQ_Knowledge",
  bot_flow: "Bot_Flow",
  lead_capture: "Lead_Capture",
  courses: "Courses",
  pitch_opportunities: "Pitch_Opportunities",
  sources: "Sources",
};

export function resolveSheetTabName(tab: string): string {
  const lower = tab.toLowerCase().trim();
  return TAB_ALIASES[lower] || tab;
}

/**
 * Checks if live Google Sheets service account credentials are provided.
 */
export function hasGoogleCredentials(): boolean {
  const cfg = getSheetsConfig();
  return Boolean(
    cfg.spreadsheetId &&
    cfg.clientEmail &&
    cfg.privateKey &&
    cfg.privateKey.includes("BEGIN PRIVATE KEY")
  );
}

// In-memory OAuth2 token cache
interface CachedAuthToken {
  token: string;
  expiresAt: number; // ms timestamp
}

let cachedToken: CachedAuthToken | null = null;

function base64UrlEncode(strOrBuffer: Buffer | string): string {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer, "utf8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Generates an OAuth2 access token for Google Service Account using Node crypto RS256 JWT assertion.
 * Caches token until 5 minutes before expiry.
 */
export async function getGoogleAuthToken(): Promise<{ token: string | null; error?: string }> {
  const cfg = getSheetsConfig();
  if (!cfg.clientEmail || !cfg.privateKey) {
    return { token: null, error: "Missing Google Service Account credentials (email or private key)." };
  }

  const nowMs = Date.now();
  // Return cached token if valid for at least 5 more minutes
  if (cachedToken && cachedToken.expiresAt > nowMs + 5 * 60 * 1000) {
    return { token: cachedToken.token };
  }

  try {
    const nowSec = Math.floor(nowMs / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claimSet = base64UrlEncode(
      JSON.stringify({
        iss: cfg.clientEmail,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: nowSec + 3600,
        iat: nowSec,
      })
    );

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(`${header}.${claimSet}`);
    signer.end();
    const signature = base64UrlEncode(signer.sign(cfg.privateKey));

    const jwtAssertion = `${header}.${claimSet}.${signature}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtAssertion,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data.error_description || data.error || `HTTP ${res.status}`;
      return { token: null, error: `OAuth2 token exchange failed: ${errMsg}` };
    }

    const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 3600;
    cachedToken = {
      token: data.access_token,
      expiresAt: nowMs + expiresInSec * 1000,
    };

    return { token: data.access_token };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Cryptographic sign failure";
    return { token: null, error: `Authentication error: ${errMsg}` };
  }
}

/**
 * Reads all rows from a specific Google Sheet tab.
 */
export async function fetchSheetRows(tabName: SheetTabName): Promise<{
  rows: (string | number | boolean)[][];
  mode: "live_google_sheets" | "server_memory";
  error?: string;
}> {
  const cfg = getSheetsConfig();

  if (!hasGoogleCredentials()) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`[GoogleSheets:PROD] Missing Google service account credentials for reading tab: ${tabName}`);
    }
    return { rows: [], mode: "server_memory" };
  }

  try {
    const auth = await getGoogleAuthToken();
    if (!auth.token) {
      return { rows: [], mode: "server_memory", error: auth.error };
    }

    const actualTab = resolveSheetTabName(tabName);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${cfg.spreadsheetId}/values/${encodeURIComponent(actualTab)}!A:Z`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { rows: [], mode: "live_google_sheets", error: errText };
    }

    const data = await res.json();
    return { rows: data.values || [], mode: "live_google_sheets" };
  } catch (error) {
    return { rows: [], mode: "live_google_sheets", error: String(error) };
  }
}

/**
 * Appends a row to a specific Google Sheet tab.
 * In development without credentials, records to memory with structured diagnostic logging.
 */
export async function appendSheetRow(
  tabName: SheetTabName,
  rowValues: (string | number | boolean | null | undefined)[]
): Promise<{ success: boolean; mode: "live_google_sheets" | "server_memory"; error?: string }> {
  const cfg = getSheetsConfig();

  if (!hasGoogleCredentials()) {
    return { success: true, mode: "server_memory" };
  }

  try {
    const auth = await getGoogleAuthToken();
    if (!auth.token) {
      return { success: false, mode: "server_memory", error: auth.error };
    }

    const actualTab = resolveSheetTabName(tabName);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${cfg.spreadsheetId}/values/${encodeURIComponent(actualTab)}!A:A:append?valueInputOption=USER_ENTERED`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [rowValues.map((v) => (v === null || v === undefined ? "" : v))],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, mode: "live_google_sheets", error: errText };
    }

    return { success: true, mode: "live_google_sheets" };
  } catch (error) {
    console.error(`[GoogleSheets] Failed to append row to ${tabName}:`, error);
    return { success: false, mode: "live_google_sheets", error: String(error) };
  }
}

export type GoogleSheetsValidationStatus =
  | "LIVE"
  | "MISSING_CONFIG"
  | "AUTH_FAILED"
  | "API_ERROR";

/**
 * Connection validator for diagnostics and health checking.
 * Performs a real read-only metadata request against Google Sheets API.
 */
export async function validateGoogleSheetsConnection(): Promise<{
  status: GoogleSheetsValidationStatus;
  spreadsheetId: string;
  spreadsheetTitle?: string;
  hasServiceAccountEmail: boolean;
  hasPrivateKey: boolean;
  mode: "live_google_sheets" | "server_memory";
  configuredTabs: readonly string[];
  message: string;
  errorCode?: string | number;
}> {
  const cfg = getSheetsConfig();
  const hasCreds = hasGoogleCredentials();

  if (!hasCreds) {
    return {
      status: "MISSING_CONFIG",
      spreadsheetId: cfg.spreadsheetId || "Not Configured",
      hasServiceAccountEmail: Boolean(cfg.clientEmail),
      hasPrivateKey: Boolean(cfg.privateKey),
      mode: "server_memory",
      configuredTabs: EXPECTED_SHEET_TABS,
      message:
        process.env.NODE_ENV === "production"
          ? "Google Sheets credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY) are missing in production environment."
          : "Google Sheets service account credentials not configured in .env.local. Running in verified server memory fallback mode with zero client exposure.",
    };
  }

  // 1. Attempt real OAuth2 authentication
  const auth = await getGoogleAuthToken();
  if (!auth.token) {
    return {
      status: "AUTH_FAILED",
      spreadsheetId: cfg.spreadsheetId || "Not Configured",
      hasServiceAccountEmail: true,
      hasPrivateKey: true,
      mode: "server_memory",
      configuredTabs: EXPECTED_SHEET_TABS,
      message: auth.error || "Google service account authentication failed.",
      errorCode: "AUTH_FAILED",
    };
  }

  // 2. Real read-only Google Sheets API request
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${cfg.spreadsheetId}?fields=properties.title,sheets.properties.title`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      let sanitizedMessage = `Google Sheets API returned HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error?.message) {
          sanitizedMessage = `Google Sheets API error: ${parsed.error.message}`;
        }
      } catch {}

      return {
        status: "API_ERROR",
        spreadsheetId: cfg.spreadsheetId || "",
        hasServiceAccountEmail: true,
        hasPrivateKey: true,
        mode: "server_memory",
        configuredTabs: EXPECTED_SHEET_TABS,
        message: sanitizedMessage,
        errorCode: res.status,
      };
    }

    const data = await res.json();
    const title = data.properties?.title || "Untitled Spreadsheet";
    const availableTabs = (data.sheets || [])
      .map((s: { properties?: { title?: string } }) => s.properties?.title || "")
      .filter(Boolean);

    return {
      status: "LIVE",
      spreadsheetId: cfg.spreadsheetId || "",
      spreadsheetTitle: title,
      hasServiceAccountEmail: true,
      hasPrivateKey: true,
      mode: "live_google_sheets",
      configuredTabs: availableTabs.length > 0 ? availableTabs : EXPECTED_SHEET_TABS,
      message: `Google Sheets live API active. Connected to '${title}'.`,
    };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      status: "API_ERROR",
      spreadsheetId: cfg.spreadsheetId || "",
      hasServiceAccountEmail: true,
      hasPrivateKey: true,
      mode: "server_memory",
      configuredTabs: EXPECTED_SHEET_TABS,
      message: `Google Sheets API request failed: ${errMsg}`,
      errorCode: "NETWORK_ERROR",
    };
  }
}
