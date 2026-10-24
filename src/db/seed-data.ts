import type { ColorSlug, ProductKind } from "../lib/catalog/constants";
import { unsplash } from "../lib/unsplash";

// Seed input for the catalog tables. Run with `npm run db:seed` (idempotent:
// rows are upserted by slug). Array order is meaningful: categories get
// `position` from it, and products are inserted in order so "Featured"
// (sorted by id) matches it.
//
// Product photos are stand-ins from Unsplash (free to use under the Unsplash
// License), credited per row, until real product photography exists.

export type SeedCategory = { slug: string; name: string; description: string };

export type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  kind: ProductKind;
  color: ColorSlug;
  material: string;
  /** Minor units (cents), USD. */
  price: number;
  /** Product photo URL. */
  image: string;
  isNew: boolean;
  stock: number;
  createdAt: string;
};

/** Starting copy per silhouette; each product gets its own copy in the database. */
export const kindCopy: Record<ProductKind, { description: string; details: string[] }> = {
  tote: {
    description: "An unlined tote cut from a single hide, with hand-stitched handles that soften with wear. Roomy enough for a laptop and a day's essentials.",
    details: ["Open top with magnetic closure", "Interior slip pocket", "Hand-painted edges", "Made in Italy"],
  },
  "shoulder-bag": {
    description: "A rounded shoulder bag with a single top handle, shaped over a hand-carved form so it keeps its curve.",
    details: ["Zip closure", "Suede-lined interior", "Detachable strap", "Made in Italy"],
  },
  loafer: {
    description: "A slip-on loafer on a slim leather sole, built on a last that sits close at the heel and relaxes over time.",
    details: ["Leather lining and sole", "Blake-stitched construction", "Rubber heel insert", "Made in Italy"],
  },
  sneaker: {
    description: "A low court sneaker with a cupsole stitched by hand, clean enough to wear with tailoring.",
    details: ["Leather lining", "Removable cushioned insole", "Stitched rubber cupsole", "Made in Portugal"],
  },
  coat: {
    description: "An unstructured coat with dropped shoulders and a long, easy line. No lining, so the cloth drapes on its own.",
    details: ["Relaxed fit, true to size", "Concealed button front", "Side seam pockets", "Made in Italy"],
  },
  knit: {
    description: "A fine-gauge knit with a close neckline and ribbed edges, warm without bulk.",
    details: ["Regular fit", "Ribbed cuffs and hem", "Fully fashioned seams", "Made in Scotland"],
  },
  scarf: {
    description: "A long silk scarf with hand-rolled edges and a short knotted fringe, printed with an archive stripe.",
    details: ["180 × 35 cm", "Hand-rolled edges", "Dry clean only", "Made in Italy"],
  },
  sunglasses: {
    description: "Round frames in hand-polished acetate with keyhole bridge and full UV protection.",
    details: ["Category 3 lenses", "100% UVA/UVB protection", "Five-barrel hinges", "Includes leather case"],
  },
  belt: {
    description: "A slim belt with a squared, brushed buckle. Cut to sit neatly through tailored trouser loops.",
    details: ["2.5 cm width", "Brushed palladium buckle", "Adjustable in five holes", "Made in Italy"],
  },
  ring: {
    description: "A ring cast from recycled metal and finished by hand, weighty enough to wear alone.",
    details: ["Recycled metal", "Hand-polished finish", "Resizing available in store", "Includes pouch"],
  },
};

export const seedCategories: SeedCategory[] = [
  {
    slug: "bags",
    name: "Bags",
    description: "Structured leather totes and soft shoulder bags.",
  },
  {
    slug: "shoes",
    name: "Shoes",
    description: "Loafers and sneakers cut from calfskin and suede.",
  },
  {
    slug: "ready-to-wear",
    name: "Ready-to-Wear",
    description: "Tailored outerwear and fine-gauge knitwear.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Silk scarves, belts and eyewear.",
  },
  {
    slug: "jewelry",
    name: "Jewelry",
    description: "Rings in sterling silver and gold.",
  },
];


export const seedProducts: SeedProduct[] = [
  // Bags
  { slug: "archive-tote-black", name: "Archive Tote", category: "bags", kind: "tote", color: "black", material: "Calfskin", price: 285000, image: unsplash("1614179689702-355944cd0918"), isNew: true, stock: 14, createdAt: "2026-10-12" }, // Photo: Laura Chouette
  { slug: "archive-tote-cognac", name: "Archive Tote", category: "bags", kind: "tote", color: "cognac", material: "Calfskin", price: 285000, image: unsplash("1598532163257-ae3c6b2524b6"), isNew: false, stock: 9, createdAt: "2026-06-02" }, // Photo: Irene Kredenets
  { slug: "crescent-shoulder-bag-ivory", name: "Crescent Shoulder Bag", category: "bags", kind: "shoulder-bag", color: "ivory", material: "Grained leather", price: 239000, image: unsplash("1604176424472-17cd740f74e9"), isNew: true, stock: 2, createdAt: "2026-10-05" }, // Photo: Maude Frédérique Lavoie
  { slug: "crescent-shoulder-bag-oxblood", name: "Crescent Shoulder Bag", category: "bags", kind: "shoulder-bag", color: "oxblood", material: "Grained leather", price: 239000, image: unsplash("1713425886495-8243c9933b00"), isNew: false, stock: 11, createdAt: "2026-04-18" }, // Photo: Muneeb Malhotra
  { slug: "weekend-tote-camel", name: "Weekend Tote", category: "bags", kind: "tote", color: "camel", material: "Suede", price: 315000, image: unsplash("1732963574895-f4b6af2dec06"), isNew: false, stock: 0, createdAt: "2026-03-09" }, // Photo: Simply Mersah

  // Shoes
  { slug: "bar-loafer-black", name: "Bar Loafer", category: "shoes", kind: "loafer", color: "black", material: "Polished calfskin", price: 98000, image: unsplash("1760616172899-0681b97a2de3"), isNew: false, stock: 18, createdAt: "2026-05-21" }, // Photo: taha siddiqui
  { slug: "bar-loafer-cognac", name: "Bar Loafer", category: "shoes", kind: "loafer", color: "cognac", material: "Polished calfskin", price: 98000, image: unsplash("1777987601447-266e128de448"), isNew: true, stock: 6, createdAt: "2026-09-28" }, // Photo: Husien Bisky
  { slug: "court-sneaker-ivory", name: "Court Sneaker", category: "shoes", kind: "sneaker", color: "ivory", material: "Leather", price: 79000, image: unsplash("1780824947013-dc7e01284025"), isNew: false, stock: 20, createdAt: "2026-02-14" }, // Photo: Jordan Hou
  { slug: "court-sneaker-navy", name: "Court Sneaker", category: "shoes", kind: "sneaker", color: "navy", material: "Suede", price: 79000, image: unsplash("1632252813474-5796eb128fa9"), isNew: true, stock: 3, createdAt: "2026-10-01" }, // Photo: Óscar Salgado
  { slug: "suede-loafer-olive", name: "Soft Suede Loafer", category: "shoes", kind: "loafer", color: "olive", material: "Suede", price: 92000, image: unsplash("1737099901049-93adf0eb87b9"), isNew: false, stock: 12, createdAt: "2026-07-07" }, // Photo: Maria Kovalets

  // Ready-to-wear
  { slug: "double-face-coat-camel", name: "Double-Face Coat", category: "ready-to-wear", kind: "coat", color: "camel", material: "Wool and cashmere", price: 420000, image: unsplash("1539533113208-f6df8cc8b543"), isNew: true, stock: 3, createdAt: "2026-10-15" }, // Photo: Bundo Kim
  { slug: "double-face-coat-black", name: "Double-Face Coat", category: "ready-to-wear", kind: "coat", color: "black", material: "Wool and cashmere", price: 420000, image: unsplash("1776256318694-922979ab0a94"), isNew: false, stock: 7, createdAt: "2026-08-11" }, // Photo: Marcin Sajur
  { slug: "tailored-overcoat-grey", name: "Tailored Overcoat", category: "ready-to-wear", kind: "coat", color: "grey", material: "Virgin wool", price: 365000, image: unsplash("1610871276695-5e79e9cd497c"), isNew: false, stock: 10, createdAt: "2026-01-30" }, // Photo: Ante Samarzija
  { slug: "cashmere-crewneck-ivory", name: "Cashmere Crewneck", category: "ready-to-wear", kind: "knit", color: "ivory", material: "Cashmere", price: 129000, image: unsplash("1606707951429-5dbb61ab34c2"), isNew: true, stock: 15, createdAt: "2026-10-09" }, // Photo: Joyful
  { slug: "cashmere-crewneck-navy", name: "Cashmere Crewneck", category: "ready-to-wear", kind: "knit", color: "navy", material: "Cashmere", price: 129000, image: unsplash("1752486268240-0507bb1ebc7e"), isNew: false, stock: 8, createdAt: "2026-05-03" }, // Photo: ZEELOOL Glasses
  { slug: "ribbed-knit-oxblood", name: "Ribbed Knit Sweater", category: "ready-to-wear", kind: "knit", color: "oxblood", material: "Merino wool", price: 98000, image: unsplash("1612629779374-a8432d338af5"), isNew: false, stock: 0, createdAt: "2026-03-22" }, // Photo: Zoe

  // Accessories
  { slug: "silk-twill-scarf-oxblood", name: "Silk Twill Scarf", category: "accessories", kind: "scarf", color: "oxblood", material: "Silk twill", price: 49000, image: unsplash("1689193502879-362660fad4a8"), isNew: true, stock: 25, createdAt: "2026-09-19" }, // Photo: Anna Keibalo
  { slug: "silk-twill-scarf-navy", name: "Silk Twill Scarf", category: "accessories", kind: "scarf", color: "navy", material: "Silk twill", price: 49000, image: unsplash("1791237769388-5dfd546f929d"), isNew: false, stock: 13, createdAt: "2026-04-02" }, // Photo: Laurenz Heymann
  { slug: "round-sunglasses-black", name: "Round Acetate Sunglasses", category: "accessories", kind: "sunglasses", color: "black", material: "Acetate", price: 52000, image: unsplash("1618677366787-c02f9a52d6e8"), isNew: false, stock: 9, createdAt: "2026-06-25" }, // Photo: Colin Lloyd
  { slug: "round-sunglasses-cognac", name: "Round Acetate Sunglasses", category: "accessories", kind: "sunglasses", color: "cognac", material: "Tortoise acetate", price: 52000, image: unsplash("1587310311582-aa7610e90826"), isNew: true, stock: 4, createdAt: "2026-10-03" }, // Photo: Anton Be
  { slug: "slim-leather-belt-black", name: "Slim Leather Belt", category: "accessories", kind: "belt", color: "black", material: "Calfskin", price: 59000, image: unsplash("1786553283657-4b080ff5c103"), isNew: false, stock: 16, createdAt: "2026-02-27" }, // Photo: Darshan Sarang

  // Jewelry
  { slug: "signet-ring-grey", name: "Signet Ring", category: "jewelry", kind: "ring", color: "grey", material: "Sterling silver", price: 45000, image: unsplash("1778759335295-b332b4eaac15"), isNew: false, stock: 11, createdAt: "2026-05-15" }, // Photo: Husien Bisky
  { slug: "band-ring-camel", name: "Knot Band Ring", category: "jewelry", kind: "ring", color: "camel", material: "18k yellow gold", price: 185000, image: unsplash("1708222169835-6329be77bee6"), isNew: true, stock: 1, createdAt: "2026-10-18" }, // Photo: Oscar Ramirez
  { slug: "chain-ring-grey", name: "Chain Link Ring", category: "jewelry", kind: "ring", color: "grey", material: "Sterling silver", price: 39000, image: unsplash("1727060664699-d760290208b1"), isNew: false, stock: 0, createdAt: "2026-07-30" }, // Photo: Tony Chen
];
