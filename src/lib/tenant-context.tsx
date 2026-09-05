"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Organization } from "@/types";
import { AuthUser } from "@/lib/auth";
import { MOCK_ORGANIZATIONS, DEFAULT_TENANT } from "@/data/mock-organizations";

interface TenantContextType {
  tenant: Organization;
  currentUser: AuthUser | null;
  isPlatformAdmin: boolean;
  availableTenants: Organization[];
  setTenantId: (tenantId: string) => void;
  getOfferLabel: (plural?: boolean) => string;
  logout: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Lazy state initialization from session storage
  const [currentTenant, setCurrentTenant] = useState<Organization>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTenantId = sessionStorage.getItem("active_tenant_id");
        if (savedTenantId) {
          const found = MOCK_ORGANIZATIONS.find((org) => org.id === savedTenantId);
          if (found) return found;
        }
      } catch {
        // Ignore
      }
    }
    return DEFAULT_TENANT;
  });

  // Fetch session on load
  useEffect(() => {
    let isMounted = true;
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.user) {
            setCurrentUser(data.user);
            if (data.organization) {
              setCurrentTenant(data.organization);
              sessionStorage.setItem("active_tenant_id", data.organization.id);
            }
          }
        }
      } catch {
        // Not logged in or network error
      }
    }
    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const isPlatformAdmin = currentUser?.role === "platform_admin";

  const setTenantId = (tenantId: string) => {
    // Non-platform admins cannot change tenants
    if (currentUser && currentUser.role !== "platform_admin") {
      return;
    }
    const found = MOCK_ORGANIZATIONS.find((org) => org.id === tenantId);
    if (found) {
      setCurrentTenant(found);
      try {
        sessionStorage.setItem("active_tenant_id", tenantId);
      } catch {
        // Ignore
      }
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      sessionStorage.removeItem("active_tenant_id");
      window.location.replace("/login");
    }
  };

  const getOfferLabel = (plural: boolean = true): string => {
    const offerType = currentTenant.offerType;
    if (!plural) {
      switch (offerType) {
        case "Courses":
          return "Course";
        case "Memberships":
          return "Membership";
        case "Properties":
          return "Property";
        case "Services":
          return "Service";
        case "Programs":
          return "Program";
        case "Products":
          return "Product";
        default:
          return "Offer";
      }
    }
    return offerType || "Offers";
  };

  return (
    <TenantContext.Provider
      value={{
        tenant: currentTenant,
        currentUser,
        isPlatformAdmin,
        availableTenants: MOCK_ORGANIZATIONS,
        setTenantId,
        getOfferLabel,
        logout,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
