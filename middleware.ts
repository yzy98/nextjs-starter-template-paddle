import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const cookies = getSessionCookie(request);

  if (!cookies) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect dashboard
    "/dashboard(.*)",
    // Protect checkout
    "/checkout(.*)",
  ],
};
