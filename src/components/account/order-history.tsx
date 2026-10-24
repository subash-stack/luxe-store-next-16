import Link from "next/link";

import { LineItem } from "@/components/bag/line-item";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { orderStatusLabel, type OrderStatus, type OrderSummary } from "@/lib/orders";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const statusTone: Record<OrderStatus, string> = {
  placed: "border-line-strong text-ink",
  shipped: "border-line-strong text-ink",
  delivered: "border-success text-success",
  cancelled: "border-danger text-danger",
};

/** Account "Your orders": one card per order, newest first. */
export function OrderHistory({ orders }: { orders: OrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <div className="border border-line px-6 py-10 text-center">
        <p className="text-body">You haven&apos;t placed any orders yet.</p>
        <p className="mt-1 text-caption text-ink-subtle">
          Orders you place while signed in will appear here.
        </p>
        <ButtonLink href="/shop" variant="secondary" className="mt-6">
          Start shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {orders.map((order) => (
        <li key={order.id} className="border border-line">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line bg-surface px-5 py-4">
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-body-sm">
              <div>
                <dt className="text-caption text-ink-subtle">Order</dt>
                <dd className="tabular-nums">{order.number}</dd>
              </div>
              <div>
                <dt className="text-caption text-ink-subtle">Placed</dt>
                <dd>
                  <time dateTime={order.createdAt.toISOString()}>
                    {dateFormat.format(order.createdAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt className="text-caption text-ink-subtle">Total</dt>
                <dd className="type-price">{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <p
              className={cn(
                "type-label border bg-canvas px-2 py-1",
                statusTone[order.status],
              )}
            >
              <span className="sr-only">Status: </span>
              {orderStatusLabel[order.status]}
            </p>
          </div>

          <ul className="divide-hairline px-5">
            {order.items.map((item) => (
              <li key={item.slug}>
                <LineItem
                  size="sm"
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

          <div className="border-t border-line px-5 py-4 text-right">
            <Link href={`/orders/${order.id}`} className="link text-caption">
              View order details
              <span className="sr-only"> for {order.number}</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
