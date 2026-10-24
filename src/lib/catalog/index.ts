import { categories, colors, products } from "./data";
import type {
  Category,
  CategorySlug,
  Color,
  ColorSlug,
  Product,
  SortKey,
} from "./types";

export type * from "./types";

export const PAGE_SIZE = 12;

export const colorBySlug = Object.fromEntries(
  colors.map((c) => [c.slug, c]),
) as Record<ColorSlug, Color>;

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

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

// Async on purpose: the signatures match the database-backed versions to come.

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getColors(): Promise<Color[]> {
  return colors;
}

export async function getProducts({
  category,
  colors: colorFilter = [],
  sort = "featured",
  page = 1,
}: ProductQuery = {}): Promise<ProductPage> {
  "use cache";

  const matches = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (colorFilter.length === 0 || colorFilter.includes(p.color)),
  );

  const sorted = [...matches];
  if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);

  const end = Math.max(1, page) * PAGE_SIZE;
  return {
    items: sorted.slice(0, end),
    total: sorted.length,
    hasMore: end < sorted.length,
  };
}

/** Colours that appear in a category, so the filter never offers empty results. */
export async function getAvailableColors(category?: CategorySlug): Promise<Color[]> {
  const used = new Set(
    products.filter((p) => !category || p.category === category).map((p) => p.color),
  );
  return colors.filter((c) => used.has(c.slug));
}

export function isSortKey(value: unknown): value is SortKey {
  return sortOptions.some((o) => o.key === value);
}

export function isColorSlug(value: unknown): value is ColorSlug {
  return colors.some((c) => c.slug === value);
}

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(cents: number) {
  return priceFormat.format(cents / 100);
}
