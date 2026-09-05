import { NextRequest, NextResponse } from "next/server";
import { SEEDED_USERS, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const foundUser = SEEDED_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!foundUser || foundUser.passwordHash !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (foundUser.status !== "active") {
      return NextResponse.json(
        { error: "This user account is inactive" },
        { status: 403 }
      );
    }

    const authUser = {
      user_id: foundUser.user_id,
      tenant_id: foundUser.tenant_id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      status: foundUser.status,
      avatar: foundUser.avatar,
    };

    const token = await createSessionToken(authUser);

    const response = NextResponse.json({
      success: true,
      user: authUser,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed", details: String(error) },
      { status: 500 }
    );
  }
}
