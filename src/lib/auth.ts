// ==========================================
// MVP SESSION-BASED AUTHENTICATION LAYER
// ==========================================

export type AuthRole = "platform_admin" | "tenant_admin" | "agent";

export interface AuthUser {
  user_id: string;
  tenant_id: string | null; // null for platform_admin with global scope
  name: string;
  email: string;
  role: AuthRole;
  status: "active" | "inactive";
  avatar?: string;
}

export interface AuthSession {
  user: AuthUser;
  expiresAt: number;
}

export const SESSION_COOKIE_NAME = "ai_wa_session";
const SESSION_SECRET = process.env.AUTH_SECRET || "ai_whatsapp_platform_mvp_secret_key_2026";

// Pre-seeded users for testing different tenants and roles
export const SEEDED_USERS: (AuthUser & { passwordHash: string })[] = [
  {
    user_id: "user-aakasa-admin",
    tenant_id: "tenant-aakasa",
    name: "Aakasa Admin",
    email: "admin@aakasa.com",
    role: "tenant_admin",
    status: "active",
    avatar: "AA",
    passwordHash: "password123",
  },
  {
    user_id: "user-aakasa-admin-edu",
    tenant_id: "tenant-aakasa",
    name: "Aakasa Admin",
    email: "admin@aakasa.edu",
    role: "tenant_admin",
    status: "active",
    avatar: "AA",
    passwordHash: "password123",
  },
  {
    user_id: "user-aakasa-agent",
    tenant_id: "tenant-aakasa",
    name: "Kavita Nair (Advisor)",
    email: "kavita@aakasa.com",
    role: "agent",
    status: "active",
    avatar: "KN",
    passwordHash: "password123",
  },
  {
    user_id: "user-apex-admin",
    tenant_id: "tenant-apex-fitness",
    name: "Apex Fitness Admin",
    email: "admin@apexfitness.com",
    role: "tenant_admin",
    status: "active",
    avatar: "AF",
    passwordHash: "password123",
  },
  {
    user_id: "user-platform-superadmin",
    tenant_id: null, // Global platform scope
    name: "Platform Superadmin",
    email: "superadmin@platform.com",
    role: "platform_admin",
    status: "active",
    avatar: "SA",
    passwordHash: "password123",
  },
];

// Helper to sign session payload using HMAC-SHA256 (Web Crypto API for Edge & Node compatibility)
export async function createSessionToken(user: AuthUser, durationSeconds = 86400 * 7): Promise<string> {
  const expiresAt = Date.now() + durationSeconds * 1000;
  const payload = JSON.stringify({ user, expiresAt });
  const payloadBase64 = Buffer.from(payload).toString("base64url");

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadBase64));
  const signatureBase64 = Buffer.from(signature).toString("base64url");

  return `${payloadBase64}.${signatureBase64}`;
}

// Helper to verify and parse session token
export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase64, signatureBase64] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(signatureBase64, "base64url"),
      encoder.encode(payloadBase64)
    );

    if (!valid) return null;

    const payloadText = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const { user, expiresAt } = JSON.parse(payloadText) as AuthSession;

    if (Date.now() > expiresAt) return null;
    return user;
  } catch {
    return null;
  }
}
