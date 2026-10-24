// Shared by the UI and the database schema (src/db/schema/catalog.ts builds its
// Postgres enums from these tuples). Keep this file free of `@/` imports:
// drizzle-kit loads it outside Next and can't resolve the alias.

export const productColors = [
  "black",
  "ivory",
  "camel",
  "cognac",
  "oxblood",
  "navy",
  "olive",
  "grey",
] as const;

export type ColorSlug = (typeof productColors)[number];

/** Silhouette used by the placeholder product art until real photography exists. */
export const productKinds = [
  "tote",
  "shoulder-bag",
  "loafer",
  "sneaker",
  "coat",
  "knit",
  "scarf",
  "sunglasses",
  "belt",
  "ring",
] as const;

export type ProductKind = (typeof productKinds)[number];

export type Color = {
  slug: ColorSlug;
  name: string;
  hex: string;
};

/** Swatch palette, in display order. Presentation only; products store the slug. */
export const colors: Color[] = [
  { slug: "black", name: "Black", hex: "#1b1b1b" },
  { slug: "ivory", name: "Ivory", hex: "#e9e2d3" },
  { slug: "camel", name: "Camel", hex: "#b88a5a" },
  { slug: "cognac", name: "Cognac", hex: "#8a4b2a" },
  { slug: "oxblood", name: "Oxblood", hex: "#5e1a1f" },
  { slug: "navy", name: "Navy", hex: "#1f2a44" },
  { slug: "olive", name: "Olive", hex: "#5b5a3a" },
  { slug: "grey", name: "Grey", hex: "#8d8d8a" },
];

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

export const PAGE_SIZE = 12;

/** At or below this many units a product shows "Only N left". */
export const LOW_STOCK_THRESHOLD = 5;
