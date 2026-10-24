import Link from "next/link";

import { ProductArt } from "@/components/product/product-art";
import { colorBySlug, formatPrice, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const color = colorBySlug[product.color];

  return (
    <article className="group relative">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-offset-0"
      >
        <div className="media-frame">
          <ProductArt
            kind={product.kind}
            tone={color.hex}
            className="transition-transform duration-(--duration-slow) ease-luxe group-hover:scale-[1.04]"
          />
          {product.isNew && (
            <span className="type-label absolute top-3 left-3 text-ink-muted">
              New
            </span>
          )}
        </div>

        <div className="space-y-1 px-2 pt-3 pb-1 text-center">
          <h3 className="text-body-sm">{product.name}</h3>
          <p className="text-caption text-ink-subtle">
            {color.name} · {product.material}
          </p>
          <p className="type-price text-ink">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
