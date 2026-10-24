import { Pool } from "@neondatabase/serverless";
import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";

import { db } from "@/db";
import { order, orderItem, orderStatuses, product, productStock } from "@/db/schema";
import { serverEnv } from "@/env";
import type { ColorSlug } from "@/lib/catalog";

// Orders. Server-only: imports `@/env`.
//
// Placing an order is a multi-step write (check stock, decrement, insert), so it
// runs in one interactive transaction on a `neon-serverless` Pool; the default
// `neon-http` client can't do that.

export type OrderLineInput = { slug: string; quantity: number };

export type OrderDetails = {
  email: string;
  phone: string;
  deliveryNote?: string;
  shippingName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  cardBrand: string;
  cardLast4: string;
};

/** Thrown when a line can't be fulfilled; the transaction rolls back. */
export class OutOfStockError extends Error {
  constructor(
    readonly productName: string,
    readonly available: number,
  ) {
    super(`${productName}: only ${available} left`);
  }
}

/**
 * Creates the order and decrements stock atomically. Prices come from the
 * database, never the client. Returns the new order id.
 */
export async function createOrder(
  lines: OrderLineInput[],
  details: OrderDetails,
  /** The signed-in shopper, so the order shows in their account. */
  userId?: string,
): Promise<string> {
  // A Pool must be created and closed within the request on serverless platforms.
  const pool = new Pool({ connectionString: serverEnv.DATABASE_URL });
  try {
    const tx = drizzle({ client: pool });
    return await tx.transaction(async (t) => {
      const rows = await t
        .select({
          id: product.id,
          slug: product.slug,
          name: product.name,
          color: product.color,
          material: product.material,
          imageUrl: product.imageUrl,
          priceCents: product.priceCents,
        })
        .from(product)
        .where(
          inArray(
            product.slug,
            lines.map((l) => l.slug),
          ),
        );
      const bySlug = new Map(rows.map((r) => [r.slug, r]));

      const items = [];
      for (const line of lines) {
        const row = bySlug.get(line.slug);
        if (!row) continue; // Removed from the catalog since it was added.

        // Conditional decrement: succeeds only if enough stock is left, so two
        // checkouts can't both take the last unit.
        const [updated] = await t
          .update(productStock)
          .set({ quantity: sql`${productStock.quantity} - ${line.quantity}` })
          .where(
            and(
              eq(productStock.productId, row.id),
              gte(productStock.quantity, line.quantity),
            ),
          )
          .returning({ quantity: productStock.quantity });
        if (!updated) {
          const [stock] = await t
            .select({ quantity: productStock.quantity })
            .from(productStock)
            .where(eq(productStock.productId, row.id));
          throw new OutOfStockError(row.name, stock?.quantity ?? 0);
        }
        items.push({ row, quantity: line.quantity });
      }
      if (items.length === 0) throw new Error("No purchasable items in the bag.");

      const subtotalCents = items.reduce((sum, i) => sum + i.row.priceCents * i.quantity, 0);
      const shippingCents = 0; // Complimentary, as promised across the site.
      const id = crypto.randomUUID();

      await t.insert(order).values({
        id,
        userId: userId ?? null,
        ...details,
        addressLine2: details.addressLine2 || null,
        deliveryNote: details.deliveryNote || null,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
      });
      await t.insert(orderItem).values(
        items.map(({ row, quantity }) => ({
          orderId: id,
          productId: row.id,
          slug: row.slug,
          name: row.name,
          color: row.color,
          material: row.material,
          imageUrl: row.imageUrl,
          unitPriceCents: row.priceCents,
          quantity,
        })),
      );
      return id;
    });
  } finally {
    await pool.end();
  }
}

export type OrderStatus = (typeof orderStatuses)[number];

export const orderStatusLabel: Record<OrderStatus, string> = {
  placed: "Order placed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type OrderSummary = {
  id: string;
  number: string;
  status: OrderStatus;
  email: string;
  phone: string | null;
  deliveryNote: string | null;
  shippingName: string;
  addressLines: string[];
  cardBrand: string;
  cardLast4: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: Date;
  items: {
    slug: string;
    name: string;
    color: ColorSlug;
    material: string;
    imageUrl: string | null;
    unitPrice: number;
    quantity: number;
  }[];
};

type OrderRow = typeof order.$inferSelect;
type OrderItemRow = typeof orderItem.$inferSelect;

function toOrderSummary(row: OrderRow, items: OrderItemRow[]): OrderSummary {
  return {
    id: row.id,
    number: `LS-${row.number}`,
    status: row.status,
    email: row.email,
    phone: row.phone,
    deliveryNote: row.deliveryNote,
    shippingName: row.shippingName,
    addressLines: [
      row.addressLine1,
      row.addressLine2,
      `${row.city} ${row.postalCode}`,
      row.country,
    ].filter((line): line is string => Boolean(line)),
    cardBrand: row.cardBrand,
    cardLast4: row.cardLast4,
    subtotal: row.subtotalCents,
    shipping: row.shippingCents,
    total: row.totalCents,
    createdAt: row.createdAt,
    items: items.map((i) => ({
      slug: i.slug,
      name: i.name,
      color: i.color,
      material: i.material,
      imageUrl: i.imageUrl,
      unitPrice: i.unitPriceCents,
      quantity: i.quantity,
    })),
  };
}

/**
 * One order with its items, read fresh (not cached): it's private to whoever
 * holds the link, and must reflect the write that just happened.
 */
export async function getOrder(id: string): Promise<OrderSummary | undefined> {
  const [[row], items] = await db.batch([
    db.select().from(order).where(eq(order.id, id)).limit(1),
    db.select().from(orderItem).where(eq(orderItem.orderId, id)).orderBy(asc(orderItem.id)),
  ]);
  return row && toOrderSummary(row, items);
}

/**
 * A signed-in user's orders, newest first, read fresh. Callers must pass the id
 * of the session user (requireUser), never one taken from the request.
 */
export async function getOrdersForUser(userId: string, limit = 50): Promise<OrderSummary[]> {
  const rows = await db
    .select()
    .from(order)
    .where(eq(order.userId, userId))
    .orderBy(desc(order.createdAt))
    .limit(limit);
  if (rows.length === 0) return [];

  const items = await db
    .select()
    .from(orderItem)
    .where(
      inArray(
        orderItem.orderId,
        rows.map((r) => r.id),
      ),
    )
    .orderBy(asc(orderItem.id));
  return rows.map((row) =>
    toOrderSummary(
      row,
      items.filter((i) => i.orderId === row.id),
    ),
  );
}
