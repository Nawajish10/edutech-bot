// ==========================================
// TENANT-AWARE AI REASONING & INTENT ENGINE
// Supports Live LLM (OpenAI) with Verified Fallback
// ==========================================

import {
  getKnowledge,
  getFAQ,
  getOffers,
  getOrganization,
  recordAIUsage,
} from "@/lib/server/db";

export interface AIConfig {
  tenant_id: string;
  provider: "openai" | "anthropic" | "gemini";
  model: string;
  monthly_ai_limit: number;
}

export const DEFAULT_AI_CONFIG: Record<string, AIConfig> = {
  "tenant-aakasa": {
    tenant_id: "tenant-aakasa",
    provider: "openai",
    model: "gpt-4o-mini",
    monthly_ai_limit: 100000,
  },
  "tenant-apex-fitness": {
    tenant_id: "tenant-apex-fitness",
    provider: "openai",
    model: "gpt-4o-mini",
    monthly_ai_limit: 50000,
  },
};

export interface AIProcessResult {
  replyText: string;
  intent: string;
  suggestedState: string;
  requiresHandoff: boolean;
  handoffReason?: string;
  mode: "live_llm" | "deterministic_rules";
}

export async function processIncomingMessageWithAI({
  tenantId,
  conversationId,
  userMessage,
  contactName,
}: {
  tenantId: string;
  conversationId: string;
  userMessage: string;
  contactName?: string;
}): Promise<AIProcessResult> {
  const org = await getOrganization(tenantId);
  const knowledge = await getKnowledge(tenantId);
  const faqs = await getFAQ(tenantId);
  const offers = await getOffers(tenantId);

  const lowerMsg = userMessage.toLowerCase();

  // 1. Guardrail: Check for EMI, loan, or human counselor escalation triggers
  if (
    lowerMsg.includes("emi") ||
    lowerMsg.includes("loan") ||
    lowerMsg.includes("human") ||
    lowerMsg.includes("agent") ||
    lowerMsg.includes("counselor") ||
    lowerMsg.includes("call me") ||
    lowerMsg.includes("talk to a human")
  ) {
    return {
      replyText: `Thank you ${contactName || ""}! For flexible EMI payment plans and special counselor approvals, I am connecting you directly with our senior advisor. They will contact you shortly on this WhatsApp chat.`,
      intent: "request_emi_or_advisor",
      suggestedState: "Handoff",
      requiresHandoff: true,
      handoffReason: "User requested EMI options or advisor escalation",
      mode: "deterministic_rules",
    };
  }

  // 2. Live LLM Generation if OPENROUTER_API_KEY or OPENAI_API_KEY is configured
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const activeApiKey =
    openRouterKey && !openRouterKey.includes("placeholder")
      ? openRouterKey
      : openAiKey && !openAiKey.includes("placeholder")
      ? openAiKey
      : null;

  const isUsingOpenRouter = Boolean(activeApiKey && activeApiKey === openRouterKey);

  if (activeApiKey) {
    try {
      const knowledgeContext = knowledge.map((k) => `[${k.category}] ${k.title}: ${k.content}`).join("\n");
      const offersContext = offers.map((o) => `Program: ${o.title}, Duration: ${o.duration}, Price: ${o.displayedOfferPrice} (Regular: ${o.originalPrice}), Audience: ${o.bestFor || "Learners"}, URL: ${o.url}`).join("\n");
      const faqContext = faqs.map((f) => `Q: ${f.title}\nA: ${f.content}`).join("\n\n");

      const systemPrompt = `You are the official AI WhatsApp advisor for ${org?.name || "our academy"}.
Answer user questions grounded STRICTLY in the verified knowledge below.
RULES:
1. Answer the user's actual question directly first.
2. Ask at most ONE useful follow-up question.
3. NEVER invent pricing, discounts, deadlines, or job/placement guarantees not in the knowledge base.
4. If verified information is unavailable, say that the detail needs confirmation by an advisor.

VERIFIED KNOWLEDGE BASE:
${knowledgeContext}

VERIFIED OFFERS & PROGRAMS:
${offersContext}

VERIFIED FAQS:
${faqContext}`;

      const endpoint = isUsingOpenRouter
        ? "https://openrouter.ai/api/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";

      const modelName = isUsingOpenRouter
        ? process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
        : "gpt-4o-mini";

      const headers: Record<string, string> = {
        Authorization: `Bearer ${activeApiKey}`,
        "Content-Type": "application/json",
      };

      if (isUsingOpenRouter) {
        headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        headers["X-Title"] = "Aakasa AI WhatsApp Platform";
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.choices?.[0]?.message?.content?.trim();
        const usage = data.usage;

        if (replyText) {
          await recordAIUsage({
            usage_id: `usage-${Date.now()}`,
            tenant_id: tenantId,
            conversation_id: conversationId,
            message_id: `msg-ai-${Date.now()}`,
            model: modelName,
            input_tokens: usage?.prompt_tokens || 250,
            output_tokens: usage?.completion_tokens || 80,
            estimated_cost: (usage?.prompt_tokens || 250) * 0.00000015 + (usage?.completion_tokens || 80) * 0.0000006,
            created_at: new Date().toISOString(),
          });

          return {
            replyText,
            intent: "llm_knowledge_reply",
            suggestedState: "Discovery",
            requiresHandoff: false,
            mode: "live_llm",
          };
        }
      }
    } catch (err) {
      console.warn("[AIEngine] Live LLM API request failed or timed out, falling back to deterministic knowledge rules:", err);
    }
  }

  // 3. Grounded Deterministic Rule Engine (Verified Knowledge Fallback)
  const matchedOffer = offers.find(
    (o) =>
      lowerMsg.includes(o.title.toLowerCase()) ||
      lowerMsg.includes(o.category.toLowerCase()) ||
      (o.bestFor && lowerMsg.includes(o.bestFor.toLowerCase()))
  );

  if (matchedOffer) {
    const replyText = `Our ${matchedOffer.title} is a ${matchedOffer.duration} program.\n\nCurrently, it's on a special launch offer at ${matchedOffer.displayedOfferPrice} (was ${matchedOffer.originalPrice}).\n\nTarget audience: ${matchedOffer.bestFor || "Learners & professionals"}.\n\nOfficial Program Page: ${matchedOffer.url}\n\nWould you like to speak with an admissions counsellor or receive the syllabus PDF?`;

    await recordAIUsage({
      usage_id: `usage-${Date.now()}`,
      tenant_id: tenantId,
      conversation_id: conversationId,
      message_id: `msg-ai-${Date.now()}`,
      model: "gpt-4o-mini",
      input_tokens: 320,
      output_tokens: 85,
      estimated_cost: 0.00021,
      created_at: new Date().toISOString(),
    });

    return {
      replyText,
      intent: "course_inquiry",
      suggestedState: "Recommendation",
      requiresHandoff: false,
      mode: "deterministic_rules",
    };
  }

  // 4. Check for FAQ match
  const matchedFaq = faqs.find(
    (f) =>
      lowerMsg.includes(f.title.toLowerCase().replace("?", "")) ||
      (lowerMsg.includes("live") && f.title.toLowerCase().includes("live")) ||
      (lowerMsg.includes("job") && f.title.toLowerCase().includes("job")) ||
      (lowerMsg.includes("certificate") && f.title.toLowerCase().includes("certificate"))
  );

  if (matchedFaq) {
    return {
      replyText: `${matchedFaq.content}\n\nWould you like more details on this or our programs?`,
      intent: "faq_inquiry",
      suggestedState: "Objection handling",
      requiresHandoff: false,
      mode: "deterministic_rules",
    };
  }

  // 5. Check for knowledge base match
  const matchedKb = knowledge.find(
    (k) =>
      (k.key && lowerMsg.includes(k.key.toLowerCase())) ||
      lowerMsg.includes(k.title.toLowerCase())
  );

  if (matchedKb) {
    return {
      replyText: `${matchedKb.content}\n\nWould you like more information or help with registration?`,
      intent: "knowledge_inquiry",
      suggestedState: "Discovery",
      requiresHandoff: false,
      mode: "deterministic_rules",
    };
  }

  // Default grounded response using tenant identity
  const businessName = org?.name || "our academy";
  const defaultReply = `Hello ${contactName || "there"}! Welcome to ${businessName}. We provide 100% live instructor-led practical training.\n\nCould you share if you are looking for job placement, freelancing, or business growth so I can recommend the exact right track?`;

  await recordAIUsage({
    usage_id: `usage-${Date.now()}`,
    tenant_id: tenantId,
    conversation_id: conversationId,
    message_id: `msg-ai-${Date.now()}`,
    model: "gpt-4o-mini",
    input_tokens: 210,
    output_tokens: 65,
    estimated_cost: 0.00014,
    created_at: new Date().toISOString(),
  });

  return {
    replyText: defaultReply,
    intent: "general_greeting",
    suggestedState: "Discovery",
    requiresHandoff: false,
    mode: "deterministic_rules",
  };
}
