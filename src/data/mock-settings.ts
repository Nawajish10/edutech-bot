import { TenantSettings } from "@/types";

export const MOCK_SETTINGS: Record<string, TenantSettings> = {
  "tenant-aakasa": {
    tenantId: "tenant-aakasa",
    businessName: "Aakasa Skills Academy",
    logo: "🎓",
    website: "https://www.aakasaskillsacademy.com",
    businessType: "Education",
    offerType: "Courses",
    primaryColor: "#1E3A8A",
    timezone: "Asia/Kolkata (GMT+5:30)",
    currency: "INR",
    autoReplyGreeting: "Hello! Welcome to Aakasa Skills Academy. How can our admissions counselor or AI guide assist you today?",
    fallbackToHumanThreshold: 2,
    notificationsEmail: "admissions@aakasaskillsacademy.com",
    notificationsWhatsapp: "+91 91234 56789",
  },
  "tenant-apex-fitness": {
    tenantId: "tenant-apex-fitness",
    businessName: "Apex Fitness & Performance",
    logo: "💪",
    website: "https://www.apexfitness.example.com",
    businessType: "Fitness",
    offerType: "Memberships",
    primaryColor: "#0D9488",
    timezone: "Asia/Kolkata (GMT+5:30)",
    currency: "INR",
    autoReplyGreeting: "Hey there! Welcome to Apex Fitness. Ready to start your fitness journey?",
    fallbackToHumanThreshold: 2,
    notificationsEmail: "hello@apexfitness.example.com",
    notificationsWhatsapp: "+91 98450 00112",
  },
};
