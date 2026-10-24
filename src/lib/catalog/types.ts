import type { ColorSlug, ProductKind } from "./constants";

export type { Color, ColorSlug, ProductKind, SortKey } from "./constants";

/** Category slugs are data now (the `category` table), not a fixed union. */
export type CategorySlug = string;

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

/** Plain, serialisable product shape that every page and component receives. */
export type Product = {
  /** Display style code, e.g. "LS-001" (derived from the database id). */
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  kind: ProductKind;
  color: ColorSlug;
  material: string;
  description: string;
  details: string[];
  /** Product photo URL, or null to show placeholder art. */
  imageUrl: string | null;
  /** Minor units (cents), USD. */
  price: number;
  isNew: boolean;
  /** Units available. 0 = sold out. */
  stock: number;
  /** ISO timestamp, used for "Newest" sorting. */
  createdAt: string;
};

export type StockState = "in-stock" | "low-stock" | "sold-out";
