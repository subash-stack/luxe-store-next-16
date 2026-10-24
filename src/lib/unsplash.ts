// No `@/` imports: the database seed loads this file outside Next.

/** Unsplash photo URL. Must match the remotePatterns `search` in next.config.ts exactly. */
export function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=2400&q=80`;
}
