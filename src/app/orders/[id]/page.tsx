import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LineItem, Totals } from "@/components/bag/line-item";
import { ButtonLink } from "@/components/ui/button";
import { getOrder } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Order confirmed",
  // Private to whoever holds the link.
  robots: { index: false },
};

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export default function OrderPage({ params }: PageProps<"/orders/[id]">) {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderDetails id={params.then((p) => p.id)} />
    </Suspense>
  );
}

/** Reads the route param and a fresh database row, so it renders at request time. */
async function OrderDetails({ id: idPromise }: { id: Promise<string> }) {
  const id = await idPromise;
  const order = await getOrder(id);
  if (!order) notFound();
  // Guest orders are reachable by their unguessable link alone. An order placed
  // while signed in is only shown to that account: a shared or leaked link
  // isn't enough. Anyone else gets the same 404 as a missing order.
  if (order.userId) {
    const user = await requireUser(`/orders/${id}`);
    if (user.id !== order.userId) notFound();
  }

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <header className="page-container pt-10 pb-8 text-center md:pt-16 md:pb-10">
        <p className="type-eyebrow">Order confirmed</p>
        <h1 className="type-headline mt-3">Thank you, {order.shippingName.split(" ")[0]}</h1>
        <p className="mx-auto mt-3 max-w-prose-narrow text-body text-ink-muted">
          Order {order.number} · placed {dateFormat.format(order.createdAt)}
        </p>
      </header>

      <div className="content-container grid gap-12 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16">
        <section aria-labelledby="items-heading">
          <h2 id="items-heading" className="type-label mb-2">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </h2>
          <ul className="divide-hairline border-y border-line">
            {order.items.map((item) => (
              <li key={item.slug}>
                <LineItem
                  slug={item.slug}
                  name={item.name}
                  color={item.color}
                  material={item.material}
                  imageUrl={item.imageUrl}
                  quantity={item.quantity}
                  lineTotal={item.unitPrice * item.quantity}
                />
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-8 lg:bg-surface lg:p-8">
          <div>
            <h2 className="type-label mb-6">Summary</h2>
            <Totals subtotal={order.subtotal} shipping={order.shipping} />
          </div>

          <dl className="grid gap-6 border-t border-line pt-6 text-body-sm sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <dt className="field-label">Shipping to</dt>
              <dd>
                {[order.shippingName, ...order.addressLines].map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="field-label">Contact</dt>
              <dd>
                <span className="block break-all">{order.email}</span>
                {order.phone && <span className="block">{order.phone}</span>}
              </dd>
            </div>
            {order.deliveryNote && (
              <div className="sm:col-span-2 lg:col-span-1">
                <dt className="field-label">Delivery note</dt>
                <dd className="whitespace-pre-line break-words">{order.deliveryNote}</dd>
              </div>
            )}
            <div>
              <dt className="field-label">Payment</dt>
              <dd>
                {order.cardBrand} ending {order.cardLast4}
                <span className="mt-1 block text-caption text-ink-subtle">
                  Demo payment: no card was charged.
                </span>
              </dd>
            </div>
          </dl>

          <ButtonLink href="/shop" variant="secondary" block>
            Continue shopping
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}

function OrderSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your order">
      <div className="page-container flex flex-col items-center gap-4 pt-10 pb-8 md:pt-16 md:pb-10">
        <div className="h-4 w-28 bg-surface" />
        <div className="h-9 w-64 max-w-full bg-surface" />
        <div className="h-4 w-56 bg-surface" />
      </div>
      <div className="content-container grid gap-12 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="h-64 bg-surface" />
        <div className="h-64 bg-surface" />
      </div>
    </div>
  );
}
