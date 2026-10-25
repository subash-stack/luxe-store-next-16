import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LineItem, Totals } from "@/components/bag/line-item";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getBag } from "@/lib/bag";
import { formatPrice } from "@/lib/catalog";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <>
      <header className="page-container pt-10 pb-8 text-center md:pt-16 md:pb-10">
        <p className="type-eyebrow">Secure checkout</p>
        <h1 className="type-headline mt-3">Payment</h1>
      </header>
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContents />
      </Suspense>
    </>
  );
}

/** Reads the session and bag cookie: request-time, so it streams in behind the boundary. */
async function CheckoutContents() {
  // An account is required so the order lands in the shopper's order history.
  // The proxy redirects signed-out visitors early; this is the real check.
  const user = await requireUser("/checkout");
  const bag = await getBag();
  const lines = bag.lines.filter((l) => l.quantity > 0);
  if (lines.length === 0) redirect("/bag");

  return (
    <div className="content-container grid gap-12 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16">
      {/* Summary first on mobile, so shoppers see what they're paying for. */}
      <aside className="border-y border-line py-6 lg:order-last lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start lg:border-y-0 lg:bg-surface lg:p-8">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="type-label">Order summary</h2>
          <Link href="/bag" className="link text-caption">
            Edit bag
          </Link>
        </div>
        <ul className="divide-hairline">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li key={product.slug}>
              <LineItem
                size="sm"
                slug={product.slug}
                name={product.name}
                color={product.color}
                material={product.material}
                imageUrl={product.imageUrl}
                kind={product.kind}
                quantity={quantity}
                lineTotal={lineTotal}
              />
            </li>
          ))}
        </ul>
        <div className="mt-2 border-t border-line pt-6">
          <Totals subtotal={bag.subtotal} />
        </div>
      </aside>

      <CheckoutForm totalLabel={formatPrice(bag.subtotal)} defaultEmail={user.email} />
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading checkout"
      className="content-container grid gap-12 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16"
    >
      <div className="space-y-5">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-12 bg-surface" />
        ))}
      </div>
      <div className="h-64 bg-surface" />
    </div>
  );
}
