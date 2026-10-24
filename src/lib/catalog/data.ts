import type { Category, Color, Product, ProductKind } from "./types";

// Sample catalog. Replace with database queries once the product schema exists.

/** Shared copy per silhouette; colour and material are added per product. */
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

export const categories: Category[] = [
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

export const products: Product[] = [
  // Bags
  { id: "p01", slug: "archive-tote-black", name: "Archive Tote", category: "bags", kind: "tote", color: "black", material: "Calfskin", price: 285000, isNew: true, stock: 14, createdAt: "2026-10-12" },
  { id: "p02", slug: "archive-tote-cognac", name: "Archive Tote", category: "bags", kind: "tote", color: "cognac", material: "Calfskin", price: 285000, isNew: false, stock: 9, createdAt: "2026-06-02" },
  { id: "p03", slug: "crescent-shoulder-bag-ivory", name: "Crescent Shoulder Bag", category: "bags", kind: "shoulder-bag", color: "ivory", material: "Grained leather", price: 239000, isNew: true, stock: 2, createdAt: "2026-10-05" },
  { id: "p04", slug: "crescent-shoulder-bag-oxblood", name: "Crescent Shoulder Bag", category: "bags", kind: "shoulder-bag", color: "oxblood", material: "Grained leather", price: 239000, isNew: false, stock: 11, createdAt: "2026-04-18" },
  { id: "p05", slug: "weekend-tote-camel", name: "Weekend Tote", category: "bags", kind: "tote", color: "camel", material: "Suede", price: 315000, isNew: false, stock: 0, createdAt: "2026-03-09" },

  // Shoes
  { id: "p06", slug: "bar-loafer-black", name: "Bar Loafer", category: "shoes", kind: "loafer", color: "black", material: "Polished calfskin", price: 98000, isNew: false, stock: 18, createdAt: "2026-05-21" },
  { id: "p07", slug: "bar-loafer-cognac", name: "Bar Loafer", category: "shoes", kind: "loafer", color: "cognac", material: "Polished calfskin", price: 98000, isNew: true, stock: 6, createdAt: "2026-09-28" },
  { id: "p08", slug: "court-sneaker-ivory", name: "Court Sneaker", category: "shoes", kind: "sneaker", color: "ivory", material: "Leather", price: 79000, isNew: false, stock: 20, createdAt: "2026-02-14" },
  { id: "p09", slug: "court-sneaker-navy", name: "Court Sneaker", category: "shoes", kind: "sneaker", color: "navy", material: "Suede", price: 79000, isNew: true, stock: 3, createdAt: "2026-10-01" },
  { id: "p10", slug: "suede-loafer-olive", name: "Soft Suede Loafer", category: "shoes", kind: "loafer", color: "olive", material: "Suede", price: 92000, isNew: false, stock: 12, createdAt: "2026-07-07" },

  // Ready-to-wear
  { id: "p11", slug: "double-face-coat-camel", name: "Double-Face Coat", category: "ready-to-wear", kind: "coat", color: "camel", material: "Wool and cashmere", price: 420000, isNew: true, stock: 3, createdAt: "2026-10-15" },
  { id: "p12", slug: "double-face-coat-black", name: "Double-Face Coat", category: "ready-to-wear", kind: "coat", color: "black", material: "Wool and cashmere", price: 420000, isNew: false, stock: 7, createdAt: "2026-08-11" },
  { id: "p13", slug: "tailored-overcoat-grey", name: "Tailored Overcoat", category: "ready-to-wear", kind: "coat", color: "grey", material: "Virgin wool", price: 365000, isNew: false, stock: 10, createdAt: "2026-01-30" },
  { id: "p14", slug: "cashmere-crewneck-ivory", name: "Cashmere Crewneck", category: "ready-to-wear", kind: "knit", color: "ivory", material: "Cashmere", price: 129000, isNew: true, stock: 15, createdAt: "2026-10-09" },
  { id: "p15", slug: "cashmere-crewneck-navy", name: "Cashmere Crewneck", category: "ready-to-wear", kind: "knit", color: "navy", material: "Cashmere", price: 129000, isNew: false, stock: 8, createdAt: "2026-05-03" },
  { id: "p16", slug: "ribbed-knit-oxblood", name: "Ribbed Knit Sweater", category: "ready-to-wear", kind: "knit", color: "oxblood", material: "Merino wool", price: 98000, isNew: false, stock: 0, createdAt: "2026-03-22" },

  // Accessories
  { id: "p17", slug: "silk-twill-scarf-oxblood", name: "Silk Twill Scarf", category: "accessories", kind: "scarf", color: "oxblood", material: "Silk twill", price: 49000, isNew: true, stock: 25, createdAt: "2026-09-19" },
  { id: "p18", slug: "silk-twill-scarf-navy", name: "Silk Twill Scarf", category: "accessories", kind: "scarf", color: "navy", material: "Silk twill", price: 49000, isNew: false, stock: 13, createdAt: "2026-04-02" },
  { id: "p19", slug: "round-sunglasses-black", name: "Round Acetate Sunglasses", category: "accessories", kind: "sunglasses", color: "black", material: "Acetate", price: 52000, isNew: false, stock: 9, createdAt: "2026-06-25" },
  { id: "p20", slug: "round-sunglasses-cognac", name: "Round Acetate Sunglasses", category: "accessories", kind: "sunglasses", color: "cognac", material: "Tortoise acetate", price: 52000, isNew: true, stock: 4, createdAt: "2026-10-03" },
  { id: "p21", slug: "slim-leather-belt-black", name: "Slim Leather Belt", category: "accessories", kind: "belt", color: "black", material: "Calfskin", price: 59000, isNew: false, stock: 16, createdAt: "2026-02-27" },

  // Jewelry
  { id: "p22", slug: "signet-ring-grey", name: "Signet Ring", category: "jewelry", kind: "ring", color: "grey", material: "Sterling silver", price: 45000, isNew: false, stock: 11, createdAt: "2026-05-15" },
  { id: "p23", slug: "band-ring-camel", name: "Knot Band Ring", category: "jewelry", kind: "ring", color: "camel", material: "18k yellow gold", price: 185000, isNew: true, stock: 1, createdAt: "2026-10-18" },
  { id: "p24", slug: "chain-ring-grey", name: "Chain Link Ring", category: "jewelry", kind: "ring", color: "grey", material: "Sterling silver", price: 39000, isNew: false, stock: 0, createdAt: "2026-07-30" },
];
