import { relations, sql } from "drizzle-orm";
import { check, index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Relative import: drizzle-kit loads this file outside Next (no `@/` alias).
import { user } from "./auth";
import { product, productColor } from "./catalog";

export const orderStatuses = ["placed", "shipped", "delivered", "cancelled"] as const;
export const orderStatus = pgEnum("order_status", orderStatuses);

export const order = pgTable(
  "order",
  {
    /** Random UUID: the order page URL is the only thing that grants access to it. */
    id: text("id").primaryKey(),
    /** Customer-facing order number, e.g. 1001 → "LS-1001". */
    number: integer("number").notNull().generatedAlwaysAsIdentity({ startWith: 1001 }),
    /** Set when the shopper was signed in at checkout; guest orders stay null. */
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    status: orderStatus("status").notNull().default("placed"),
    email: text("email").notNull(),
    /** Required at checkout; nullable so orders placed before it was added stay valid. */
    phone: text("phone"),
    deliveryNote: text("delivery_note"),
    shippingName: text("shipping_name").notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").notNull(),
    /** Demo payment: only the brand and last four digits are ever stored. */
    cardBrand: text("card_brand").notNull(),
    cardLast4: text("card_last4").notNull(),
    /** Minor units (cents), USD. */
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("order_user_id_idx").on(t.userId),
    check("order_total_cents_nonnegative", sql`${t.totalCents} >= 0`),
  ],
);

/** One row per product in an order, with name and price as they were at purchase. */
export const orderItem = pgTable(
  "order_item",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    /** Null once the product is deleted; the snapshot columns below still describe it. */
    productId: integer("product_id").references(() => product.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    color: productColor("color").notNull(),
    material: text("material").notNull(),
    imageUrl: text("image_url"),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (t) => [
    index("order_item_order_id_idx").on(t.orderId),
    check("order_item_quantity_positive", sql`${t.quantity} > 0`),
  ],
);

export const orderRelations = relations(order, ({ many }) => ({
  items: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
}));
