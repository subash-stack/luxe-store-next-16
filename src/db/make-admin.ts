/**
 * Grant or revoke the admin role for an existing user.
 *
 *   npm run auth:make-admin -- someone@example.com
 *   npm run auth:make-admin -- someone@example.com --revoke
 *
 * Uses its own client instead of `@/db` so it only needs DATABASE_URL.
 */
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { user } from "./schema/auth";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Add it to .env.local.");

  const args = process.argv.slice(2);
  const email = args.find((a) => !a.startsWith("--"))?.trim().toLowerCase();
  if (!email) throw new Error("Usage: npm run auth:make-admin -- <email> [--revoke]");
  const role = args.includes("--revoke") ? "user" : "admin";

  const db = drizzle({ client: neon(url) });
  const updated = await db
    .update(user)
    .set({ role })
    .where(eq(user.email, email))
    .returning({ email: user.email, role: user.role });

  if (updated.length === 0) throw new Error(`No user with email ${email}.`);
  console.log(`${updated[0].email} is now "${updated[0].role}"`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
