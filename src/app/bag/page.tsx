import type { Metadata } from "next";
import { Suspense } from "react";

import { LineItem, Totals } from "@/components/bag/line-item";
import { Button, ButtonLink } from "@/components/ui/button";
import { MAX_QUANTITY, getBag } from "@/lib/bag";

import { removeFromBag, setQuantity } from "./actions";

const stepperButton =
  "grid size-11 place-items-center text-body text-ink transition-colors duration-(--duration-fast) hover:bg-surface disabled:pointer-events-none disabled:text-ink-subtle";

export const metadata: Metadata = {
  title: "Shopping bag",
};

export default function BagPage() {
  return (
    <>
      <header className="page-container pt-10 pb-8 text-center md:pt-16 md:pb-10">
        <p className="type-eyebrow">Your selection</p>
        <h1 className="type-headline mt-3">Shopping bag</h1>
      </header>
      <Suspense fallback={<BagSkeleton />}>
        <BagContents />
      </Suspense>
    </>
  );
}

/** Reads the bag cookie: request-time, so it streams in behind the boundary. */
async function BagContents() {
  const bag = await getBag();

  if (bag.lines.length === 0) {
    return (
      <div className="content-container border-t border-line pt-section pb-section text-center">
        <p className="text-title">Your bag is empty</p>
        <p className="mt-2 text-body text-ink-muted">
          Pieces you add will wait here until you&apos;re ready.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/new-arrivals">New arrivals</ButtonLink>
          <ButtonLink href="/shop" variant="secondary">
            Shop all
          </ButtonLink>
        </div>
      </div>
    );
  }

  const unavailable = bag.lines.some((l) => l.quantity === 0);

  return (
    <div className="content-container grid gap-12 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16">
      <ul className="divide-hairline self-start border-y border-line">
        {bag.lines.map(({ product, quantity, lineTotal }) => {
          const cap = Math.min(MAX_QUANTITY, product.stock);
          return (
            <li key={product.slug}>
              <LineItem
                slug={product.slug}
                name={product.name}
                color={product.color}
                material={product.material}
                imageUrl={product.imageUrl}
                kind={product.kind}
                quantity={quantity}
                lineTotal={lineTotal}
              >
                <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                  {quantity === 0 ? (
                    <p className="text-caption text-danger">Sold out</p>
                  ) : (
                    <div className="flex items-center border border-line">
                      <form action={setQuantity.bind(null, product.slug, quantity - 1)}>
                        <button
                          type="submit"
                          className={stepperButton}
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          −
                        </button>
                      </form>
                      <span className="w-8 text-center text-body-sm tabular-nums" aria-live="polite">
                        {quantity}
                      </span>
                      <form action={setQuantity.bind(null, product.slug, quantity + 1)}>
                        <button
                          type="submit"
                          className={stepperButton}
                          disabled={quantity >= cap}
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          +
                        </button>
                      </form>
                    </div>
                  )}
                  <form action={removeFromBag.bind(null, product.slug)}>
                    <Button type="submit" variant="ghost" className="text-caption">
                      Remove
                    </Button>
                  </form>
                </div>
              </LineItem>
            </li>
          );
        })}
      </ul>

      <aside className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
        <h2 className="type-label mb-6">Order summary</h2>
        <Totals subtotal={bag.subtotal} />
        {unavailable && (
          <p className="mt-4 text-caption text-danger">
            Sold-out pieces won&apos;t be included in your order.
          </p>
        )}
        <div className="mt-8 grid gap-3">
          {bag.count > 0 ? (
            <ButtonLink href="/checkout" block>
              Checkout
            </ButtonLink>
          ) : (
            <Button block disabled>
              Checkout
            </Button>
          )}
          <ButtonLink href="/shop" variant="secondary" block>
            Continue shopping
          </ButtonLink>
        </div>
        <p className="mt-4 text-caption text-ink-subtle">
          Complimentary shipping and returns within 30 days. You&apos;ll sign in or create an
          account before payment, so your orders appear in your account.
        </p>
      </aside>
    </div>
  );
}

function BagSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading your bag"
      className="content-container grid gap-12 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16"
    >
      <div className="divide-hairline border-y border-line">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex gap-4 py-5">
            <div className="media-frame w-24 animate-pulse md:w-28" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 bg-surface" />
              <div className="h-3 w-1/3 bg-surface" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-48 bg-surface" />
    </div>
  );
}
