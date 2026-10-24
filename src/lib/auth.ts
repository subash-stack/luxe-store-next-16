import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import { serverEnv } from "@/env";

// Base Better Auth instance. Sign-in methods (email/password, social providers)
// and plugins are intentionally not configured yet.
export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg" }),
  // nextCookies must stay last so cookies set in server actions are applied.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
