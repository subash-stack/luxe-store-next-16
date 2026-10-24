import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

// Data access layer for the signed-in user. Server-only: it reads request
// headers and imports `@/env` through `auth`.
//
// Session reads are request-time data under Cache Components: never call these
// inside "use cache", and render their callers inside a <Suspense> boundary.

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function toCurrentUser(user: NonNullable<Session>["user"]): CurrentUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? "user",
  };
}

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

/** The current session, or null. Deduplicated per request. */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

/** Only same-site paths, so `?next=` can't be used as an open redirect. */
export function safeNext(next: unknown, fallback = "/account") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
    ? next
    : fallback;
}

function signInRedirect(next: string): never {
  redirect(`/sign-in?next=${encodeURIComponent(next)}`);
}

/** The signed-in user, or a redirect to sign-in. */
export async function requireUser(next = "/account"): Promise<CurrentUser> {
  const session = await getSession();
  if (!session) signInRedirect(next);
  return toCurrentUser(session.user);
}

/**
 * The signed-in admin. Bypasses the cookie cache so a revoked role applies on
 * the next request. Non-admins get a 404 so the area isn't advertised.
 */
export const requireAdmin = cache(async (): Promise<CurrentUser> => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  if (!session) signInRedirect("/admin");
  // The admin plugin stores multiple roles comma-separated.
  if (!session.user.role?.split(",").includes("admin")) notFound();
  return toCurrentUser(session.user);
});
