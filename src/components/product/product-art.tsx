import type { ReactNode } from "react";

import type { ProductKind } from "@/lib/catalog";
import { cn } from "@/lib/cn";

// Placeholder product imagery: a flat silhouette in the product's colour on the
// surface backdrop. Shown only for products without an `imageUrl`.

const shapes: Record<ProductKind, ReactNode> = {
  tote: (
    <>
      <path d="M112 172c0-62 76-62 76 0" fill="none" strokeWidth="7" />
      <path d="M70 322 86 172h128l16 150Z" />
    </>
  ),
  "shoulder-bag": (
    <>
      <path d="M96 196C96 100 204 100 204 196" fill="none" strokeWidth="5" />
      <path d="M78 286c0-56 32-92 72-92s72 36 72 92c0 18-14 30-32 30h-80c-18 0-32-12-32-30Z" />
      <circle cx="150" cy="232" r="7" className="opacity-40" />
    </>
  ),
  loafer: (
    <>
      <path d="M48 286c0-28 18-40 50-44 34-4 48-28 78-28 26 0 40 22 62 32 22 9 18 40 6 42H60c-8 0-12-1-12-2Z" />
      <path d="M48 288h200v10H48Z" className="opacity-60" />
      <path d="M150 230h34" fill="none" strokeWidth="5" className="opacity-50" />
    </>
  ),
  sneaker: (
    <>
      <path d="M46 280c4-30 22-48 52-50l40-36c14-12 34-10 44 4l24 32c20 6 44 14 48 40 2 10-4 16-14 16H58c-8 0-13-2-12-6Z" />
      <path d="M44 286h212v14H44Z" className="opacity-25" />
      <path d="M128 222l18 18m-2-34 18 18" fill="none" strokeWidth="4" className="opacity-40" />
    </>
  ),
  coat: (
    <>
      <path d="M126 72 96 84 72 132 58 334h40l8-150 6 150h76l6-150 8 150h40l-14-202-24-48-30-12-24 64Z" />
      <path d="M126 72l24 64 24-64" fill="none" strokeWidth="4" className="opacity-40" />
    </>
  ),
  knit: (
    <>
      <path d="M112 88 80 100 42 206l28 10 26-62v170h108V154l26 62 28-10-38-106-32-12c-8 22-68 22-76 0Z" />
      <path d="M96 314h108" fill="none" strokeWidth="6" className="opacity-40" />
    </>
  ),
  scarf: (
    <>
      <path d="M118 64h64v236l22 40H96l22-40Z" />
      <path d="M104 344v18m14-18v18m14-18v18m14-18v18m14-18v18m14-18v18m14-18v18" fill="none" strokeWidth="3" />
      <path d="M118 120h64" fill="none" strokeWidth="4" className="opacity-40" />
    </>
  ),
  sunglasses: (
    <>
      <circle cx="102" cy="206" r="42" />
      <circle cx="198" cy="206" r="42" />
      <path d="M140 200c6-8 14-8 20 0" fill="none" strokeWidth="6" />
      <path d="M60 196 38 184m202 12 22-12" fill="none" strokeWidth="6" />
    </>
  ),
  belt: (
    <>
      <path d="M36 190h228v28H36Z" />
      <path d="M118 176h48v56h-48Z" fill="none" strokeWidth="7" />
      <path d="M206 204h4m16 0h4m16 0h4" fill="none" strokeWidth="4" className="opacity-40" />
    </>
  ),
  ring: (
    <>
      <circle cx="150" cy="222" r="54" fill="none" strokeWidth="16" />
      <path d="M150 140l18 20-18 18-18-18Z" />
    </>
  ),
};

export type ProductArtView = "front" | "detail" | "reverse";

// SVG transforms that fake extra gallery shots from one silhouette.
const viewTransform: Record<ProductArtView, string | undefined> = {
  front: undefined,
  detail: "translate(150 215) scale(2.1) translate(-150 -215)",
  reverse: "translate(300 0) scale(-1 1)",
};

type ProductArtProps = {
  kind: ProductKind;
  tone: string;
  view?: ProductArtView;
  className?: string;
};

export function ProductArt({ kind, tone, view = "front", className }: ProductArtProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      aria-hidden="true"
      className={cn("absolute inset-0 size-full", className)}
      fill={tone}
      stroke={tone}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {view !== "detail" && (
        <ellipse cx="150" cy="352" rx="96" ry="7" fill="#000" stroke="none" opacity="0.06" />
      )}
      {/* Soft edge keeps pale colourways (ivory) legible on the surface. */}
      <g
        transform={viewTransform[view]}
        style={{ filter: "drop-shadow(0 0 0.75px rgb(0 0 0 / 0.35))" }}
      >
        {shapes[kind]}
      </g>
    </svg>
  );
}
