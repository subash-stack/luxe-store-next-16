export type CategorySlug =
  | "bags"
  | "shoes"
  | "ready-to-wear"
  | "accessories"
  | "jewelry";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

/** Silhouette used by the placeholder product art until real photography exists. */
export type ProductKind =
  | "tote"
  | "shoulder-bag"
  | "loafer"
  | "sneaker"
  | "coat"
  | "knit"
  | "scarf"
  | "sunglasses"
  | "belt"
  | "ring";

export type ColorSlug =
  | "black"
  | "ivory"
  | "camel"
  | "cognac"
  | "oxblood"
  | "navy"
  | "olive"
  | "grey";

export type Color = {
  slug: ColorSlug;
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  kind: ProductKind;
  color: ColorSlug;
  material: string;
  /** Minor units (cents), USD. */
  price: number;
  isNew: boolean;
  /** ISO date, used for "Newest" sorting. */
  createdAt: string;
};

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";
