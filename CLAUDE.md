# CLAUDE.md

@AGENTS.md

## Gotchas

- **Tailwind v4 runs through the `@tailwindcss/turbopack` loader rule in `next.config.ts`, not PostCSS.** Don't add `postcss.config.*` or `@tailwindcss/postcss`, even though the bundled Next docs describe that setup.
- **`cacheComponents` and `partialPrefetching` are on.** Read the Cache Components guides in `node_modules/next/dist/docs/` before writing any data fetching, caching (`"use cache"`) or dynamic-API code. Older Next patterns don't apply.
- **Never import `src/env.ts` from client code.** Importing it, even just for `clientEnv`, runs the server schema check in the browser, which throws. In client code, read `process.env.NEXT_PUBLIC_*` directly, as `src/lib/auth-client.ts` does. Add every new env var to both `src/env.ts` and `.env.example`.
- **`db` uses the `neon-http` driver, which has no interactive transactions.** For multi-step writes (checkout, stock updates), use a `drizzle-orm/neon-serverless` `Pool` client. Don't wrap them in `db.transaction` on the HTTP client.
- **After changing auth config or plugins:** run `npm run auth:generate`, make sure `src/db/schema/index.ts` re-exports `./auth`, then run `npm run db:generate && npm run db:migrate`.
- **`npm run build` needs real env vars** (see `.env.example`), because env validation runs when modules load. There is no test runner yet, so verify changes with `npm run typecheck`, `npm run lint` and `npm run build`.
- **Don't run `npm audit fix --force`.** The moderate advisories come from esbuild under the dev-only `drizzle-kit`, and the forced fix downgrades `drizzle-kit`.
