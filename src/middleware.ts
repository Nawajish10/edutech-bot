import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/inbox",
  "/leads",
  "/messaging",
  "/courses",
  "/offers",
  "/knowledge-base",
  "/whatsapp",
  "/analytics",
  "/team",
  "/settings",
];

const PLATFORM_PREFIXES = ["/platform"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PLATFORM_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname === "/";

  const isPlatformOnly = PLATFORM_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = pathname === "/login";

  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = sessionCookie ? await verifySessionToken(sessionCookie) : null;

  // Unauthenticated user trying to access protected route
  if (isProtected && !user) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/" && pathname !== "/dashboard") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated non-superadmin user trying to access /platform/*
  if (isPlatformOnly && user && user.role !== "platform_admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Authenticated user trying to access /login
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/inbox/:path*",
    "/leads/:path*",
    "/messaging/:path*",
    "/courses/:path*",
    "/offers/:path*",
    "/knowledge-base/:path*",
    "/whatsapp/:path*",
    "/analytics/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/platform/:path*",
  ],
};
