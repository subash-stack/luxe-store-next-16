import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AddToBag } from "@/components/bag/add-to-bag";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { StockStatus } from "@/components/product/stock-status";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import {
  colorBySlug,
  formatPrice,
  getCategory,
  getColorways,
  getProduct,
  getRelatedProducts,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";

/**
 * Reads the route's slug, so it must render inside <Suspense>:
 * the App Shell stays URL-independent.
 */
export async function ProductDetail({ slug: slugPromise }: { slug: Promise<string> }) {
  const product = await getProduct(await slugPromise);
  if (!product) notFound();

  const [category, colorways, related] = await Promise.all([
    getCategory(product.category),
    getColorways(product),
    getRelatedProducts(product),
  ]);
  const color = colorBySlug[product.color];
  const soldOut = product.stock <= 0;

  return (
    <>
      <div className="page-container grid gap-8 pt-0 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16 lg:pt-8">
        <ProductGallery product={product} tone={color.hex} />

        <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
          <nav aria-label="Breadcrumb" className="text-caption text-ink-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/shop" className="hover:text-ink">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/shop/${product.category}`} className="hover:text-ink">
                  {category?.name}
                </Link>
              </li>
            </ol>
          </nav>

          {product.isNew && !soldOut && <p className="type-eyebrow mt-8">New</p>}
          <h1 className={cn("type-headline", product.isNew && !soldOut ? "mt-2" : "mt-8")}>
            {product.name}
          </h1>
          <p className="type-price mt-3 text-body-lg">{formatPrice(product.price)}</p>

          <div className="mt-8 border-t pt-6">
            <p className="text-caption text-ink-muted">
              Colour: <span className="text-ink">{color.name}</span>
            </p>
            {colorways.length > 1 && (
              <ul className="mt-3 flex gap-3" aria-label="Available colours">
                {colorways.map((variant) => {
                  const swatch = colorBySlug[variant.color];
                  const current = variant.id === product.id;
                  return (
                    <li key={variant.id}>
                      <Link
                        href={`/products/${variant.slug}`}
                        aria-current={current ? "page" : undefined}
                        aria-label={swatch.name}
                        title={swatch.name}
                        className={cn(
                          "block size-7 rounded-full border border-line transition-[outline-color]",
                          current
                            ? "outline outline-1 outline-offset-2 outline-ink"
                            : "outline outline-1 outline-offset-2 outline-transparent hover:outline-line",
                        )}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <StockStatus stock={product.stock} />
            <div className="mt-4 grid gap-3">
              {soldOut ? (
                <>
                  <Button block disabled>
                    Sold out
                  </Button>
                  <Button variant="secondary" block>
                    Notify me when available
                  </Button>
                </>
              ) : (
                <AddToBag slug={product.slug} />
              )}
            </div>
            <p className="mt-4 text-caption text-ink-subtle">
              Complimentary shipping and returns within 30 days.
            </p>
          </div>

          <div className="mt-10 border-b">
            <InfoSection title="Description" open>
              <p>{product.description}</p>
            </InfoSection>
            <InfoSection title="Details">
              <ul className="space-y-1.5">
                <li>{product.material}</li>
                <li>Colour: {color.name}</li>
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
                <li className="pt-2 text-ink-subtle">Style {product.id.toUpperCase()}</li>
              </ul>
            </InfoSection>
            <InfoSection title="Shipping and returns">
              <p>
                Complimentary express delivery in 2–4 business days, gift-wrapped as
                standard. Return unworn pieces within 30 days for a full refund.
              </p>
            </InfoSection>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <Section className="border-t">
          <Container>
            <h2 className="type-headline mb-8">You may also like</h2>
            <ul className="rail -mx-gutter px-gutter scroll-px-gutter">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}

function InfoSection({
  title,
  open,
  children,
}: {
  title: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={open} className="group border-t">
      <summary className="type-label flex cursor-pointer list-none items-center justify-between py-5 select-none [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden="true"
          className="transition-transform duration-(--duration-base) group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-6 text-body text-ink-muted">{children}</div>
    </details>
  );
}
