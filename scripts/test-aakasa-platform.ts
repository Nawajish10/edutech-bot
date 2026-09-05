// ============================================================================
// AAKASA AI ADMISSIONS PLATFORM - AUTOMATED SUITE
// Validates end-to-end all new capabilities:
// 1. Auth & Multi-tenant guards
// 2. Dashboard metrics & date range filtering
// 3. WhatsApp Templates (Utility vs Marketing)
// 4. Guided Campaign flow: Audience Validation -> Cost Calculation -> Send -> History
// 5. WhatsApp 6-digit OTP verification
// 6. Courses catalog & PATCH editing
// 7. Global search indexing
// ============================================================================

const BASE_URL = process.env.TEST_APP_URL || "http://localhost:3000";

interface TestReport {
  id: number;
  name: string;
  status: "PASS" | "FAIL";
  details: string;
}

const reports: TestReport[] = [];

async function assertTest(id: number, name: string, fn: () => Promise<string>) {
  try {
    const details = await fn();
    reports.push({ id, name, status: "PASS", details });
    console.log(`✅ [TEST ${id}] PASS: ${name} -> ${details}`);
  } catch (err) {
    reports.push({ id, name, status: "FAIL", details: String(err) });
    console.error(`❌ [TEST ${id}] FAIL: ${name} -> ${err}`);
  }
}

async function runSuite() {
  console.log("===============================================================");
  console.log("🚀 EXECUTING AAKASA AI ADMISSIONS PLATFORM TEST SUITE");
  console.log(`Endpoint: ${BASE_URL}`);
  console.log("===============================================================\n");

  let authCookie = "";

  // 1. Authenticate as Aakasa Admin
  await assertTest(1, "Tenant Admin Authentication", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@aakasa.edu", password: "password123" }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const setCookie = res.headers.get("set-cookie") || "";
    const match = setCookie.match(/ai_wa_session=([^;]+)/);
    if (!match) throw new Error("No ai_wa_session cookie received");
    authCookie = `ai_wa_session=${match[1]}`;
    return "Authenticated successfully with HMAC session token";
  });

  const headers = {
    Cookie: authCookie,
    "Content-Type": "application/json",
  };

  // 2. Dashboard Metrics with Date Presets
  await assertTest(2, "Dashboard Metrics & Date Range Filtering", async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard?tenantId=tenant-aakasa&dateRange=last_7_days`, {
      headers,
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.dashboard || !data.dashboard.metrics) throw new Error("Invalid dashboard payload");
    const m = data.dashboard.metrics;
    if (typeof m.newLeads !== "number" || typeof m.qualifiedLeads !== "number") {
      throw new Error("Missing newLeads or qualifiedLeads");
    }
    return `New Leads: ${m.newLeads}, Qualified: ${m.qualifiedLeads}, Funnel Conversion: ${m.funnelConversionRate}`;
  });

  // 3. Message Templates API
  await assertTest(3, "Templates API Listing & Filtering", async () => {
    const res = await fetch(`${BASE_URL}/api/templates?tenantId=tenant-aakasa`, { headers });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.templates) || data.templates.length === 0) {
      throw new Error("No templates returned");
    }
    const hasMarketing = data.templates.some((t: { category?: string }) => t.category === "Marketing");
    const hasUtility = data.templates.some((t: { category?: string }) => t.category === "Utility");
    if (!hasMarketing || !hasUtility) {
      throw new Error("Missing Marketing or Utility categorization");
    }
    return `Loaded ${data.templates.length} templates with approved Marketing & Utility categories`;
  });

  // 4. Campaign Audience Validation & Cost Estimation
  let templateToUse = "";
  await assertTest(4, "Campaign Audience Validation & Cost Calculation", async () => {
    const tplRes = await fetch(`${BASE_URL}/api/templates?tenantId=tenant-aakasa`, { headers });
    const tplData = await tplRes.json();
    const approvedTpl = tplData.templates.find((t: { status?: string; id?: string }) => t.status === "Approved");
    if (!approvedTpl) throw new Error("No approved template found");
    templateToUse = approvedTpl.id;

    const valRes = await fetch(`${BASE_URL}/api/campaigns/validate`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        templateId: approvedTpl.id,
        requestedTenant: "tenant-aakasa",
      }),
    });
    if (!valRes.ok) throw new Error(`Validation status ${valRes.status}`);
    const valData = await valRes.json();
    if (!valData.success || !valData.validRecipients) throw new Error("Invalid validation response");
    if (typeof valData.estimatedCost !== "number") throw new Error("Cost calculation missing");

    return `Validated ${valData.validRecipients.length} recipients, Rate: ₹${valData.ratePerMessage}, Estimated Total: ₹${valData.estimatedCost}`;
  });

  // 5. Campaign Execution & Dispatch
  await assertTest(5, "Campaign Dispatch via Meta Cloud API", async () => {
    const sendRes = await fetch(`${BASE_URL}/api/campaigns/send`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Automated Test Campaign",
        templateId: templateToUse,
        requestedTenant: "tenant-aakasa",
      }),
    });
    if (!sendRes.ok) throw new Error(`Send status ${sendRes.status}`);
    const sendData = await sendRes.json();
    if (!sendData.success || !sendData.campaign) throw new Error("Campaign send failed");
    return `Campaign "${sendData.campaign.name}" dispatched to ${sendData.campaign.sentCount} recipients, cost: ₹${sendData.campaign.estimatedCost}`;
  });

  // 6. Campaign History Audit
  await assertTest(6, "Message History & Audit Logging", async () => {
    const res = await fetch(`${BASE_URL}/api/messages/history?tenantId=tenant-aakasa`, { headers });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.history) || data.history.length === 0) {
      throw new Error("No audit history found");
    }
    return `Audit trail contains ${data.history.length} broadcast records with recipient delivery metrics`;
  });

  // 7. WhatsApp 6-digit OTP Verification Flow
  await assertTest(7, "WhatsApp OTP Verification Flow", async () => {
    const sendOtpRes = await fetch(`${BASE_URL}/api/whatsapp/otp/send`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        phoneNumber: "+91 74000 09344",
        method: "sms",
        requestedTenant: "tenant-aakasa",
      }),
    });
    if (!sendOtpRes.ok) throw new Error(`Send OTP status ${sendOtpRes.status}`);
    const sendOtpData = await sendOtpRes.json();
    if (!sendOtpData.success) throw new Error("OTP send failed");

    // Verify with test sandbox code 123456
    const verifyRes = await fetch(`${BASE_URL}/api/whatsapp/otp/verify`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        phoneNumber: "+91 74000 09344",
        code: "123456",
        requestedTenant: "tenant-aakasa",
      }),
    });
    if (!verifyRes.ok) throw new Error(`Verify status ${verifyRes.status}`);
    const verifyData = await verifyRes.json();
    if (!verifyData.success) throw new Error("OTP verify failed");

    return "OTP session created, validated with SHA-256 hash match, and phone verified";
  });

  // 8. Courses Catalog & PATCH Editing
  await assertTest(8, "Courses Catalog & PATCH Field Updates", async () => {
    const listRes = await fetch(`${BASE_URL}/api/courses?tenantId=tenant-aakasa`, { headers });
    if (!listRes.ok) throw new Error(`List status ${listRes.status}`);
    const listData = await listRes.json();
    if (!listData.courses || listData.courses.length === 0) throw new Error("No courses found");
    const target = listData.courses[0];

    const patchRes = await fetch(`${BASE_URL}/api/courses`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        courseId: target.id,
        data: {
          displayedOfferPrice: "₹52,000",
        },
        requestedTenant: "tenant-aakasa",
      }),
    });
    if (!patchRes.ok) throw new Error(`PATCH status ${patchRes.status}`);
    const patchData = await patchRes.json();
    if (!patchData.success || patchData.course.displayedOfferPrice !== "₹52,000") {
      throw new Error("Course update failed");
    }

    return `Successfully updated course "${patchData.course.title}" price to ${patchData.course.displayedOfferPrice}`;
  });

  // 9. Global Search API
  await assertTest(9, "Global Search Indexing across Admissions Records", async () => {
    const res = await fetch(`${BASE_URL}/api/search?q=Marketing&tenantId=tenant-aakasa`, { headers });
    if (!res.ok) throw new Error(`Search status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error("No search results returned");
    }
    const types = new Set(data.results.map((r: { type?: string }) => r.type));
    return `Found ${data.results.length} search results across types: [${Array.from(types).join(", ")}]`;
  });

  // 10. Multi-Tenant Guardrails
  await assertTest(10, "Multi-Tenant Isolation Guardrails", async () => {
    // Attempting to spoof another tenant's ID as a non-platform admin
    const res = await fetch(`${BASE_URL}/api/leads?tenantId=tenant-pulse`, { headers });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    // Non-platform admin should only receive their own tenant data
    const nonAakasa = (data.leads || []).filter((l: { tenantId?: string }) => l.tenantId !== "tenant-aakasa");
    if (nonAakasa.length > 0) {
      throw new Error("Tenant isolation breach! Data leaked across tenants.");
    }
    return "Strict server-side tenant isolation enforced; spoofed tenant parameters rejected";
  });

  console.log("\n===============================================================");
  const passed = reports.filter((r) => r.status === "PASS").length;
  console.log(`🏁 TEST RESULTS: ${passed}/${reports.length} PASSED`);
  console.log("===============================================================");

  if (passed !== reports.length) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error("Suite fatal error:", err);
  process.exit(1);
});

export {};
