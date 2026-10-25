import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { db } from "@/db";
import { serverEnv } from "@/env";

// Email/password only for now: no social login, password reset or 2FA.
export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  session: {
    // Database sessions that last 30 days and slide forward once a day.
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    // Signed cookie copy of the session, so most reads skip the database.
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  // Sign-in and sign-up go through our Server Actions (src/lib/auth-actions.ts),
  // which apply rate limits. Their HTTP endpoints would bypass those, and
  // nothing in the app calls them, so they're switched off.
  disabledPaths: ["/sign-in/email", "/sign-up/email"],
  plugins: [
    // Adds user.role (not settable on sign-up). Admin checks live in src/lib/session.ts.
    admin({ defaultRole: "user", adminRoles: ["admin"] }),
    // nextCookies must stay last so cookies set in server actions are applied.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
