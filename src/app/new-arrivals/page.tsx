import type { Metadata } from "next";

import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { getNewArrivals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "New arrivals",
  description: "The latest pieces to arrive, newest first.",
};

// No URL data, so the whole page prerenders from the cached catalog read.
export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <>
      <header className="page-container pt-10 pb-8 text-center md:pt-16 md:pb-10">
        <p className="type-eyebrow">Just in</p>
        <h1 className="type-headline mt-3">New arrivals</h1>
        <p className="mx-auto mt-3 max-w-prose-narrow text-body text-ink-muted">
          The latest pieces to arrive, newest first.
        </p>
      </header>

      {/* Same hairline bar as the shop toolbar, with the count only. */}
      <div className="border-y border-line">
        <div className="page-container flex h-12 items-center">
          <p className="text-caption text-ink-muted">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="page-container pt-px pb-section">
        {products.length > 0 ? (
          <ul className="product-grid">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-section text-center">
            <p className="text-title">Nothing new just yet</p>
            <ButtonLink href="/shop" variant="secondary" className="mt-6">
              Shop all
            </ButtonLink>
          </div>
        )}
      </div>
    </>
  );
}
