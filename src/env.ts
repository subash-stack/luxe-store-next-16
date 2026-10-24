import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
});

/**
 * Server-only environment variables. Never import this from client components.
 */
export const serverEnv = serverSchema.parse(process.env);

/**
 * Public environment variables. Next.js inlines NEXT_PUBLIC_* at build time,
 * so each key must be referenced explicitly.
 */
export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
