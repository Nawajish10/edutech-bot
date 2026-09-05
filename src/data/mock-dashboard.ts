import { DashboardMetrics } from "@/types";

export interface DashboardData {
  tenantId: string;
  metrics: DashboardMetrics;
  funnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
  activityChart: {
    time: string;
    aiMessages: number;
    humanMessages: number;
    leadsCaptured: number;
  }[];
  topOfferInterests: {
    offerName: string;
    inquiries: number;
    conversionRate: string;
  }[];
  sourceBreakdown: {
    source: string;
    count: number;
    percentage: number;
  }[];
  aiPerformance: {
    metric: string;
    value: string;
    description: string;
    status: "positive" | "neutral" | "warning";
  }[];
  upcomingFollowups: {
    id: string;
    leadName: string;
    phone: string;
    offer: string;
    scheduledFor: string;
    assignedTo: string;
    priority: "High" | "Medium" | "Low";
  }[];
  needsAttention?: {
    id: string;
    name: string;
    course: string;
    timeAgo: string;
    intentBadge: "High Intent" | "Fees Enquiry" | "Human Handoff" | "Counselling";
    phone: string;
    conversationId?: string;
    avatar?: string;
  }[];
  conversationTrends?: {
    date: string;
    total: number;
    aiHandled: number;
    humanHandled: number;
  }[];
}

export const MOCK_DASHBOARD_DATA: Record<string, DashboardData> = {
  "tenant-aakasa": {
    tenantId: "tenant-aakasa",
    metrics: {
      newConversations: 342,
      newConversationsChange: "+14.8% vs last week",
      qualifiedLeads: 128,
      qualifiedLeadsChange: "+22.4% vs last week",
      humanHandoffs: 34,
      humanHandoffsChange: "-5.1% vs last week",
      highIntentActions: 76,
      highIntentActionsLabel: "Counselling Requests",
      highIntentActionsChange: "+18.2% vs last week",
      conversions: 42,
      conversionsChange: "+9.5% vs last week",
    },
    funnel: [
      { stage: "WhatsApp Inbound", count: 850, percentage: 100 },
      { stage: "Engaged by AI", count: 680, percentage: 80 },
      { stage: "Lead Qualified", count: 340, percentage: 40 },
      { stage: "Counselling Booked", count: 160, percentage: 19 },
      { stage: "Enrolled / Converted", count: 88, percentage: 10 },
    ],
    activityChart: [
      { time: "Mon", aiMessages: 240, humanMessages: 45, leadsCaptured: 18 },
      { time: "Tue", aiMessages: 310, humanMessages: 52, leadsCaptured: 24 },
      { time: "Wed", aiMessages: 290, humanMessages: 40, leadsCaptured: 21 },
      { time: "Thu", aiMessages: 380, humanMessages: 61, leadsCaptured: 32 },
      { time: "Fri", aiMessages: 420, humanMessages: 58, leadsCaptured: 36 },
      { time: "Sat", aiMessages: 280, humanMessages: 34, leadsCaptured: 22 },
      { time: "Sun", aiMessages: 210, humanMessages: 25, leadsCaptured: 15 },
    ],
    topOfferInterests: [
      {
        offerName: "AI Lead Generation & Marketing Automation",
        inquiries: 94,
        conversionRate: "27.6%",
      },
      {
        offerName: "AI Social Media Growth & Content Automation",
        inquiries: 88,
        conversionRate: "25.0%",
      },
      {
        offerName: "AI-Powered Digital Marketing Career Program",
        inquiries: 78,
        conversionRate: "24.3%",
      },
      {
        offerName: "AI-Powered Digital Marketing Professional Program",
        inquiries: 64,
        conversionRate: "21.8%",
      },
      {
        offerName: "AI-Powered Digital Marketing & Prompt Strategy",
        inquiries: 59,
        conversionRate: "25.4%",
      },
    ],
    sourceBreakdown: [
      { source: "WhatsApp Click-to-Chat Ads", count: 412, percentage: 48 },
      { source: "Website Widget", count: 245, percentage: 29 },
      { source: "Instagram Direct Link", count: 128, percentage: 15 },
      { source: "Organic / Referrals", count: 65, percentage: 8 },
    ],
    aiPerformance: [
      {
        metric: "Avg First Response Time",
        value: "1.4s",
        description: "Instant AI turnaround on incoming WhatsApp inquiries",
        status: "positive",
      },
      {
        metric: "AI Lead Qualification Rate",
        value: "78.4%",
        description: "Inquiries successfully guided through qualification checklist",
        status: "positive",
      },
      {
        metric: "Handoff Escalation Rate",
        value: "9.9%",
        description: "Conversations requiring human advisor takeover",
        status: "neutral",
      },
      {
        metric: "Knowledge Base Hit Rate",
        value: "94.2%",
        description: "Queries accurately answered using verified offer docs",
        status: "positive",
      },
    ],
    upcomingFollowups: [
      {
        id: "flw-1",
        leadName: "Rahul Sharma",
        phone: "+91 98201 44521",
        offer: "AI-Powered Digital Marketing Career Program",
        scheduledFor: "Today, 11:30 AM",
        assignedTo: "Kavita Nair",
        priority: "High",
      },
      {
        id: "flw-2",
        leadName: "Pooja Mehta",
        phone: "+91 97112 88410",
        offer: "AI Lead Generation & Marketing Automation",
        scheduledFor: "Today, 2:00 PM",
        assignedTo: "Arjun Verma",
        priority: "High",
      },
      {
        id: "flw-3",
        leadName: "Vikram Malhotra",
        phone: "+91 98330 19283",
        offer: "AI-Powered Performance Marketing Specialist",
        scheduledFor: "Tomorrow, 10:00 AM",
        assignedTo: "Kavita Nair",
        priority: "Medium",
      },
      {
        id: "flw-4",
        leadName: "Sneha Reddy",
        phone: "+91 99881 23049",
        offer: "AI-Powered SEO & GEO Specialist",
        scheduledFor: "Tomorrow, 3:30 PM",
        assignedTo: "Arjun Verma",
        priority: "Medium",
      },
    ],
  },
  "tenant-apex-fitness": {
    tenantId: "tenant-apex-fitness",
    metrics: {
      newConversations: 185,
      newConversationsChange: "+11.2% vs last week",
      qualifiedLeads: 82,
      qualifiedLeadsChange: "+19.0% vs last week",
      humanHandoffs: 21,
      humanHandoffsChange: "-2.4% vs last week",
      highIntentActions: 54,
      highIntentActionsLabel: "Trial Session Bookings",
      highIntentActionsChange: "+14.3% vs last week",
      conversions: 29,
      conversionsChange: "+12.1% vs last week",
    },
    funnel: [
      { stage: "WhatsApp Inbound", count: 420, percentage: 100 },
      { stage: "Engaged by AI", count: 350, percentage: 83 },
      { stage: "Goal Assessed", count: 180, percentage: 43 },
      { stage: "Trial Booked", count: 95, percentage: 23 },
      { stage: "Active Member", count: 45, percentage: 11 },
    ],
    activityChart: [
      { time: "Mon", aiMessages: 120, humanMessages: 25, leadsCaptured: 10 },
      { time: "Tue", aiMessages: 150, humanMessages: 30, leadsCaptured: 14 },
      { time: "Wed", aiMessages: 140, humanMessages: 28, leadsCaptured: 12 },
      { time: "Thu", aiMessages: 190, humanMessages: 35, leadsCaptured: 18 },
      { time: "Fri", aiMessages: 210, humanMessages: 32, leadsCaptured: 20 },
      { time: "Sat", aiMessages: 160, humanMessages: 20, leadsCaptured: 15 },
      { time: "Sun", aiMessages: 110, humanMessages: 15, leadsCaptured: 8 },
    ],
    topOfferInterests: [
      {
        offerName: "Personal Coaching & Transformation Track",
        inquiries: 47,
        conversionRate: "44.6%",
      },
      {
        offerName: "Elite Annual Athlete Membership",
        inquiries: 35,
        conversionRate: "40.0%",
      },
    ],
    sourceBreakdown: [
      { source: "Instagram Ads", count: 210, percentage: 50 },
      { source: "Walk-in QR Code", count: 126, percentage: 30 },
      { source: "Website Inquiry", count: 84, percentage: 20 },
    ],
    aiPerformance: [
      {
        metric: "Avg First Response Time",
        value: "1.2s",
        description: "Fast instant greeting and fitness intake response",
        status: "positive",
      },
      {
        metric: "AI Trial Booking Rate",
        value: "65.8%",
        description: "Prospects guided to selecting trial workout slot",
        status: "positive",
      },
      {
        metric: "Handoff Escalation Rate",
        value: "11.3%",
        description: "Transferred to gym front desk or head coach",
        status: "neutral",
      },
      {
        metric: "Knowledge Base Hit Rate",
        value: "96.1%",
        description: "Facility hours and membership FAQs answered",
        status: "positive",
      },
    ],
    upcomingFollowups: [
      {
        id: "flw-apex-1",
        leadName: "Amitabh Sen",
        phone: "+91 98450 11223",
        offer: "Personal Coaching & Transformation Track",
        scheduledFor: "Today, 12:00 PM",
        assignedTo: "Coach Rohan",
        priority: "High",
      },
    ],
  },
};
