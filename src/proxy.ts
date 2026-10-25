import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only: it looks for the session cookie without validating it.
// The real checks are requireUser() / requireAdmin() in src/lib/session.ts.
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const signIn = new URL("/sign-in", request.url);
  signIn.searchParams.set("next", pathname + search);
  return NextResponse.redirect(signIn);
}

export const config = {
  // Checkout needs an account so every order shows in its owner's history.
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*"],
};
