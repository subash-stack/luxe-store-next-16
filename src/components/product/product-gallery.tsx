import { ProductArt, type ProductArtView } from "@/components/product/product-art";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";

const shots: { view: ProductArtView; backdrop: string; label: string }[] = [
  { view: "front", backdrop: "bg-surface", label: "Front" },
  { view: "detail", backdrop: "bg-surface", label: "Detail" },
  { view: "reverse", backdrop: "bg-surface-strong", label: "Reverse" },
];

/**
 * Swipeable full-width carousel on mobile (CSS scroll snap, no JS);
 * a two-column stack of large frames from lg up.
 */
export function ProductGallery({ product, tone }: { product: Product; tone: string }) {
  return (
    <div
      role="region"
      aria-label={`${product.name} images`}
      className="scrollbar-none -mx-gutter flex snap-x snap-mandatory gap-px overflow-x-auto lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible"
    >
      {shots.map((shot, i) => (
        <figure
          key={shot.label}
          className={cn(
            "media-frame w-full shrink-0 snap-start",
            shot.backdrop,
            // First shot spans both columns on desktop: one hero image, then details.
            i === 0 && "lg:col-span-2 lg:aspect-portrait",
          )}
        >
          <ProductArt kind={product.kind} tone={tone} view={shot.view} />
          <figcaption className="sr-only">
            {product.name}, {shot.label.toLowerCase()} view
          </figcaption>
          <span
            aria-hidden="true"
            className="absolute right-3 bottom-3 text-caption text-ink-subtle tabular-nums lg:hidden"
          >
            {i + 1} / {shots.length}
          </span>
        </figure>
      ))}
    </div>
  );
}
