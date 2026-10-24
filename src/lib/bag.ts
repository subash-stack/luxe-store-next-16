import { cookies } from "next/headers";
import { z } from "zod";

import { getProduct, type Product } from "@/lib/catalog";

// Shopping bag, stored in a cookie as [{ slug, quantity }]. Only slugs and
// quantities live there; prices, names and stock always come from the catalog.
//
// Reading the cookie is request-time data under Cache Components: render
// callers inside <Suspense>. Writes happen in Server Actions (src/app/bag/actions.ts).

const COOKIE = "bag";
/** Per-line cap, on top of available stock. */
export const MAX_QUANTITY = 10;

const bagSchema = z
  .array(
    z.object({
      slug: z.string().min(1).max(200),
      quantity: z.number().int().min(1).max(MAX_QUANTITY),
    }),
  )
  .max(50);

export type BagEntry = z.infer<typeof bagSchema>[number];

export type BagLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

export type Bag = {
  lines: BagLine[];
  count: number;
  subtotal: number;
};

/** Raw cookie contents. Anything malformed reads as an empty bag. */
export async function readBagEntries(): Promise<BagEntry[]> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = bagSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

/** Server Actions only: cookies can't be set once rendering has started. */
export async function writeBagEntries(entries: BagEntry[]) {
  const store = await cookies();
  if (entries.length === 0) {
    store.delete(COOKIE);
    return;
  }
  store.set(COOKIE, JSON.stringify(entries), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/** Total units in the bag, without touching the database (header count). */
export async function getBagCount(): Promise<number> {
  const entries = await readBagEntries();
  return entries.reduce((sum, e) => sum + e.quantity, 0);
}

/**
 * The bag joined with the catalog. Products that no longer exist are dropped and
 * quantities are clamped to what's in stock, so the bag never promises more
 * than can ship.
 */
export async function getBag(): Promise<Bag> {
  const entries = await readBagEntries();
  const products = await Promise.all(entries.map((e) => getProduct(e.slug)));

  const lines: BagLine[] = [];
  entries.forEach((entry, i) => {
    const product = products[i];
    if (!product) return;
    const quantity = Math.min(entry.quantity, product.stock);
    lines.push({ product, quantity, lineTotal: product.price * quantity });
  });

  return {
    lines,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
  };
}
