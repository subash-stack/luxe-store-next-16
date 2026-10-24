import { and, asc, count, desc, eq, inArray, ne, sql, type SQL } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { category, product, productStock } from "@/db/schema";

import {
  colors,
  LOW_STOCK_THRESHOLD,
  PAGE_SIZE,
  productColors,
  sortOptions,
  type Color,
  type ColorSlug,
  type SortKey,
} from "./constants";
import type { Category, CategorySlug, Product, StockState } from "./types";

export type * from "./types";
export { colors, LOW_STOCK_THRESHOLD, PAGE_SIZE, sortOptions } from "./constants";

export const colorBySlug = Object.fromEntries(
  colors.map((c) => [c.slug, c]),
) as Record<ColorSlug, Color>;

export type ProductQuery = {
  category?: CategorySlug;
  colors?: ColorSlug[];
  sort?: SortKey;
  /** 1-based; results include every page up to this one ("Load more"). */
  page?: number;
};

export type ProductPage = {
  items: Product[];
  total: number;
  hasMore: boolean;
};

// ---------------------------------------------------------------------------
// Reads. Each is cached (Cache Components) and tagged so writers can
// invalidate: revalidateTag("catalog") for content, revalidateTag("stock")
// after inventory changes.
// ---------------------------------------------------------------------------

const categoryColumns = {
  slug: category.slug,
  name: category.name,
  description: category.description,
};

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");
  return db.select(categoryColumns).from(category).orderBy(asc(category.position));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");
  const [row] = await db
    .select(categoryColumns)
    .from(category)
    .where(eq(category.slug, slug))
    .limit(1);
  return row;
}

export async function getProducts({
  category: categorySlug,
  colors: colorFilter = [],
  sort = "featured",
  page = 1,
}: ProductQuery = {}): Promise<ProductPage> {
  "use cache";
  cacheTag("catalog", "stock");
  cacheLife("minutes");

  const where = and(
    categorySlug ? eq(category.slug, categorySlug) : undefined,
    colorFilter.length > 0 ? inArray(product.color, colorFilter) : undefined,
  );
  const limit = Math.max(1, page) * PAGE_SIZE;

  const [rows, [{ total }]] = await db.batch([
    selectProducts().where(where).orderBy(...productOrder[sort]).limit(limit),
    db
      .select({ total: count() })
      .from(product)
      .innerJoin(category, eq(product.categoryId, category.id))
      .where(where),
  ]);

  return { items: rows.map(toProduct), total, hasMore: limit < total };
}

/** Products flagged as new (the same flag behind the "New" badge), newest first. */
export async function getNewArrivals(limit?: number): Promise<Product[]> {
  "use cache";
  cacheTag("catalog", "stock");
  cacheLife("minutes");
  const query = selectProducts()
    .where(eq(product.isNew, true))
    .orderBy(...productOrder.newest);
  const rows = await (limit ? query.limit(limit) : query);
  return rows.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheTag("catalog", "stock");
  cacheLife("minutes");
  const [row] = await selectProducts().where(eq(product.slug, slug)).limit(1);
  return row && toProduct(row);
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");
  const rows = await db.select({ slug: product.slug }).from(product).orderBy(asc(product.id));
  return rows.map((r) => r.slug);
}

/** Same style in other colours (matched by name within the category). */
export async function getColorways(item: Product): Promise<Product[]> {
  "use cache";
  cacheTag("catalog", "stock");
  cacheLife("minutes");
  const rows = await selectProducts()
    .where(and(eq(category.slug, item.category), eq(product.name, item.name)))
    .orderBy(asc(product.id));
  return rows.map(toProduct);
}

/** Other pieces from the same category first, then the rest; newest first within each. */
export async function getRelatedProducts(item: Product, limit = 4): Promise<Product[]> {
  "use cache";
  cacheTag("catalog", "stock");
  cacheLife("minutes");
  const rows = await selectProducts()
    .where(ne(product.name, item.name))
    .orderBy(
      desc(sql`${category.slug} = ${item.category}`),
      desc(product.createdAt),
      asc(product.id),
    )
    .limit(limit);
  return rows.map(toProduct);
}

/** Colours that appear in a category, so the filter never offers empty results. */
export async function getAvailableColors(categorySlug?: CategorySlug): Promise<Color[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");
  const rows = await db
    .selectDistinct({ color: product.color })
    .from(product)
    .innerJoin(category, eq(product.categoryId, category.id))
    .where(categorySlug ? eq(category.slug, categorySlug) : undefined);
  const used = new Set(rows.map((r) => r.color));
  return colors.filter((c) => used.has(c.slug));
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/** Product + category slug + stock quantity: everything a `Product` needs. */
function selectProducts() {
  return db
    .select({
      id: product.id,
      slug: product.slug,
      name: product.name,
      categorySlug: category.slug,
      kind: product.kind,
      color: product.color,
      material: product.material,
      description: product.description,
      details: product.details,
      imageUrl: product.imageUrl,
      priceCents: product.priceCents,
      isNew: product.isNew,
      stock: productStock.quantity,
      createdAt: product.createdAt,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryId, category.id))
    .leftJoin(productStock, eq(productStock.productId, product.id));
}

// Ties fall back to id (seed order), matching the old stable in-memory sort.
const productOrder: Record<SortKey, SQL[]> = {
  featured: [asc(product.id)],
  newest: [desc(product.createdAt), asc(product.id)],
  "price-asc": [asc(product.priceCents), asc(product.id)],
  "price-desc": [desc(product.priceCents), asc(product.id)],
};

type ProductRow = Awaited<ReturnType<typeof selectProducts>>[number];

/** Database row → the plain, serialisable shape the storefront renders. */
function toProduct(row: ProductRow): Product {
  return {
    id: `LS-${String(row.id).padStart(3, "0")}`,
    slug: row.slug,
    name: row.name,
    category: row.categorySlug,
    kind: row.kind,
    color: row.color,
    material: row.material,
    description: row.description,
    details: row.details,
    imageUrl: row.imageUrl,
    price: row.priceCents,
    isNew: row.isNew,
    stock: row.stock ?? 0,
    createdAt: row.createdAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Pure helpers (no database)
// ---------------------------------------------------------------------------

export function stockState(stock: number): StockState {
  if (stock <= 0) return "sold-out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function isSortKey(value: unknown): value is SortKey {
  return sortOptions.some((o) => o.key === value);
}

export function isColorSlug(value: unknown): value is ColorSlug {
  return productColors.includes(value as ColorSlug);
}

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(cents: number) {
  return priceFormat.format(cents / 100);
}
