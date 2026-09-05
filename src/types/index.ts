// ==========================================
// MULTI-TENANT SAAS CORE DATA ENTITIES
// Synchronized with Google Spreadsheet Data
// ==========================================

export type BusinessType =
  | "Education"
  | "Fitness"
  | "Real Estate"
  | "Consulting"
  | "Healthcare"
  | "E-Commerce"
  | "Other";

export type OfferType =
  | "Courses"
  | "Memberships"
  | "Properties"
  | "Services"
  | "Programs"
  | "Products";

export interface Organization {
  id: string;
  name: string;
  parentCompany?: string;
  slug: string;
  logo: string;
  website: string;
  supportPhone?: string;
  supportEmail?: string;
  address?: string;
  businessType: BusinessType;
  offerType: OfferType;
  primaryColor: string;
  secondaryColor?: string;
  timezone: string;
  currency: string;
  highIntentActionLabel: string;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = "Platform Admin" | "Owner" | "Admin" | "Agent";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Invited" | "Inactive";
  lastActive: string;
  avatar?: string;
}

export interface Contact {
  id: string;
  tenantId: string;
  phone: string;
  name?: string;
  email?: string;
  city?: string;
  avatarUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ConversationStatus = "open" | "waiting" | "resolved" | "closed";
export type ConversationMode = "AI Handling" | "Human Agent";

export interface Conversation {
  id: string;
  tenantId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  status: ConversationStatus;
  mode: ConversationMode;
  assignedTo?: string;
  lastMessageSnippet: string;
  lastMessageAt: string;
  unreadCount: number;
  tags: string[];
  firstMessageHandled?: boolean;
  botState?: string;
  intent?: string;
  capturedEntities?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type MessageSenderType = "customer" | "ai" | "agent" | "system";

export interface Message {
  id: string;
  tenantId: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderName?: string;
  content: string;
  timestamp: string;
  deliveryStatus?: "sent" | "delivered" | "read";
  messageId?: string; // WhatsApp wamid
  botState?: string;
}

export type LeadStatus =
  | "New"
  | "Engaged"
  | "Qualified"
  | "Follow-up"
  | "Converted"
  | "Lost";

export interface Lead {
  id: string;
  tenantId: string;
  contactId: string;
  conversationId?: string;
  name: string;
  phone: string;
  email?: string;
  goal: string;
  experienceLevel: string;
  offerInterest: string;
  currentStatus?: string;
  budget: string;
  preferredStartDate: string;
  city: string;
  questions?: string;
  humanHandoff: boolean;
  status: LeadStatus;
  assignedTo: string;
  source: string;
  score?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  url: string;
  category: string;
  description: string;
  duration: string;
  originalPrice: string;
  displayedOfferPrice: string;
  price: string; // compatibility helper
  coreTopics?: string[];
  bestFor?: string;
  qualificationNotes?: string;
  status: "Active" | "Draft" | "Archived";
  inquiryCount: number;
  conversionCount: number;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export type KnowledgeCategory =
  | "General Information"
  | "Brand"
  | "Delivery"
  | "Outcomes"
  | "Learning"
  | "Audience"
  | "Contact"
  | "Commercial"
  | "Offers"
  | "FAQs"
  | "Policies"
  | "AI Instructions";

export interface KnowledgeBaseItem {
  id: string;
  tenantId: string;
  title: string;
  category: KnowledgeCategory;
  key?: string;
  content: string;
  agentUsage?: string;
  missingDetailEscalation?: string;
  status: "Published" | "Draft" | "Review Needed";
  tags: string[];
  lastUpdated: string;
  updatedBy: string;
  source?: string;
}

export interface PromotionRule {
  id: string;
  tenantId: string;
  offer: string;
  details: string;
  validity: string;
  agentRule: string;
  source: string;
}

export interface BotFlowStage {
  id: string;
  tenantId: string;
  stage: string;
  trigger: string;
  agentAction: string;
  nextQuestion: string;
  outputToolAction: string;
}

export interface LeadCaptureSlot {
  id: string;
  tenantId: string;
  field: string;
  required: string;
  purpose: string;
  exampleValues: string;
}

export interface PitchOpportunity {
  id: string;
  tenantId: string;
  priority: "High" | "Medium" | "Low";
  observedOpportunity: string;
  whatToPropose: string;
  businessValue: string;
  evidence: string;
}

export interface KnowledgeSource {
  id: string;
  tenantId: string;
  source: string;
  url: string;
  whatWasExtracted: string;
  notes: string;
}

export interface WhatsAppConnection {
  id: string;
  tenantId: string;
  businessName: string;
  phoneNumber: string;
  displayPhoneNumber: string;
  wabaId: string;
  phoneNumberId: string;
  connectionStatus: "Connected" | "Connecting" | "Disconnected" | "Action Required";
  webhookStatus: "Active" | "Degraded" | "Inactive";
  qualityRating: "High" | "Medium" | "Low" | "Unknown";
  aiAssistantEnabled: boolean;
  autoReplyEnabled: boolean;
  humanHandoffEnabled: boolean;
  lastSyncAt: string;
}

export interface AnalyticsEvent {
  id: string;
  tenantId: string;
  eventType:
    | "conversation_started"
    | "message_received"
    | "ai_response"
    | "lead_created"
    | "lead_qualified"
    | "human_handoff"
    | "offer_clicked";
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardMetrics {
  newConversations: number;
  newConversationsChange: string;
  qualifiedLeads: number;
  qualifiedLeadsChange: string;
  humanHandoffs: number;
  humanHandoffsChange: string;
  highIntentActions: number;
  highIntentActionsLabel: string;
  highIntentActionsChange: string;
  conversions: number;
  conversionsChange: string;
  newLeads?: number;
  newLeadsChange?: string;
  admissionsInfluenced?: number;
  admissionsInfluencedChange?: string;
  aiHandledConversations?: number;
  humanAssistedConversations?: number;
  needsAttentionCount?: number;
  highIntentNeedsAttentionCount?: number;
  funnelConversionRate?: string;
}

export interface TenantSettings {
  tenantId: string;
  businessName: string;
  logo: string;
  website: string;
  businessType: BusinessType;
  offerType: OfferType;
  primaryColor: string;
  timezone: string;
  currency: string;
  autoReplyGreeting: string;
  fallbackToHumanThreshold: number;
  notificationsEmail: string;
  notificationsWhatsapp: string;
}

export type TemplateCategory = "Utility" | "Marketing";
export type TemplateStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

export interface WhatsAppTemplate {
  id: string;
  tenantId: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  headerType?: "TEXT" | "IMAGE" | "NONE";
  headerText?: string;
  body: string;
  footer?: string;
  buttons?: Array<{ type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER"; text: string; value?: string }>;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = "Draft" | "Scheduled" | "Sending" | "Completed" | "Failed";

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  templateId: string;
  templateName: string;
  category: TemplateCategory;
  audienceFilter?: string;
  targetCount: number;
  validCount: number;
  excludedCount: number;
  status: CampaignStatus;
  estimatedCost: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdAt: string;
  createdBy: string;
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  tenantId: string;
  leadId?: string;
  phone: string;
  name: string;
  status: "valid" | "excluded" | "sent" | "delivered" | "read" | "failed";
  exclusionReason?: string;
  messageId?: string;
  cost?: number;
  updatedAt: string;
}

export interface WhatsAppPricing {
  utilityRate: number; // e.g. 0.35 INR / message
  marketingRate: number; // e.g. 0.72 INR / message
  currency: string; // e.g. "INR"
}

export interface WhatsAppOtpSession {
  tenantId: string;
  phoneNumber: string;
  method: "sms" | "voice";
  otpHash: string;
  expiresAt: number;
  verified: boolean;
  attempts: number;
}

export interface SearchResult {
  id: string;
  type: "lead" | "conversation" | "course" | "template" | "campaign";
  title: string;
  subtitle: string;
  url: string;
}

