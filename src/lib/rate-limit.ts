import { createHmac } from "node:crypto";

import { sql } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { appRateLimit } from "@/db/schema";
import { serverEnv } from "@/env";

// Rate limits for Server Actions. Server-only: imports `@/env`.
//
// Better Auth's own limiter only runs on HTTP requests to /api/auth, not on the
// `auth.api.*` calls our sign-in/sign-up actions make, and it keeps counts in
// memory per instance. This one is shared via Postgres.

export type RateLimitRule = { max: number; windowSeconds: number };

export const rateLimits = {
  /** Per IP: slows password guessing across many accounts. */
  signInIp: { max: 20, windowSeconds: 15 * 60 },
  /** Per email: slows guessing one account's password from many IPs. */
  signInEmail: { max: 8, windowSeconds: 15 * 60 },
  signUpIp: { max: 5, windowSeconds: 60 * 60 },
  /** Orders reduce real stock, so one visitor can't drain the catalog. */
  checkoutIp: { max: 5, windowSeconds: 60 * 60 },
  /** Per account, so one shopper can't spread orders across many IPs. */
  checkoutUser: { max: 5, windowSeconds: 60 * 60 },
} satisfies Record<string, RateLimitRule>;

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/** Keyed HMAC, so stored keys can't be reversed to an IP or email address. */
function hashKey(bucket: string, id: string) {
  const digest = createHmac("sha256", serverEnv.BETTER_AUTH_SECRET)
    .update(`${bucket}:${id.toLowerCase()}`)
    .digest("base64url");
  return `${bucket}:${digest}`;
}

/**
 * Counts one attempt for `id` in `bucket` and reports whether it's within the
 * rule. A single upsert, so concurrent requests can't both slip under the limit.
 */
export async function consumeRateLimit(
  bucket: keyof typeof rateLimits,
  id: string,
): Promise<RateLimitResult> {
  const rule = rateLimits[bucket];
  const window = sql`make_interval(secs => ${rule.windowSeconds})`;
  const expired = sql`${appRateLimit.windowStart} <= now() - ${window}`;

  const [row] = await db
    .insert(appRateLimit)
    .values({ key: hashKey(bucket, id), count: 1 })
    .onConflictDoUpdate({
      target: appRateLimit.key,
      set: {
        count: sql`case when ${expired} then 1 else ${appRateLimit.count} + 1 end`,
        windowStart: sql`case when ${expired} then now() else ${appRateLimit.windowStart} end`,
      },
    })
    .returning({
      count: appRateLimit.count,
      retryAfter: sql<number>`ceil(extract(epoch from ${appRateLimit.windowStart} + ${window} - now()))::int`,
    });

  if (row.count <= rule.max) return { allowed: true };
  return { allowed: false, retryAfterSeconds: Math.max(1, row.retryAfter) };
}

/**
 * The visitor's IP as reported by the hosting proxy (Vercel sets both headers
 * and overwrites any value the client sent). Falls back to one shared bucket
 * locally, where neither header exists.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** "Try again in 12 minutes." */
export function retryMessage(seconds: number) {
  const minutes = Math.ceil(seconds / 60);
  return minutes <= 1
    ? "Too many attempts. Try again in a minute."
    : `Too many attempts. Try again in ${minutes} minutes.`;
}
