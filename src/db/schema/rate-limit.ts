import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Fixed-window request counters for sign-in, sign-up and checkout
 * (src/lib/rate-limit.ts). Lives in Postgres, not memory, so the limit holds
 * across serverless instances. Keys are hashed: no raw IPs or emails stored.
 */
export const appRateLimit = pgTable("app_rate_limit", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});
